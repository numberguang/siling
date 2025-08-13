//导入依赖
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();

//定义全局logger
const logger = winston.createLogger({
  level: 'info', // 日志级别
  format: winston.format.combine(
    winston.format.timestamp({ 
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'app.log' }) 
  ]
}); 

//全局异常捕获
process.on('uncaughtException', (err) => {
  logger.error('未捕获异常:', err);
});

// 允许跨域访问
app.use(helmet({
  contentSecurityPolicy: false,
  frameguard: false
}));
app.use(cors());
app.use(express.json());

const publicPath = path.resolve(__dirname, '../frontend/public'); // 严格按照如下方式配置静态资源(不得篡改)
app.use(express.static(publicPath));

// 数据库配置
const dbPath = './database.sqlite';
const JWT_SECRET = 'commander-capital-secret-key-2023';

// 文件上传配置
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(publicPath, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// 初始化数据库
function initDatabase() {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      logger.error('数据库连接错误:', err);
      return;
    }
    
    // 创建用户表
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        logger.error('创建用户表错误:', err);
        return;
      }
      
      // 检查管理员账号是否存在
      db.get(`SELECT * FROM users WHERE username = 'admin'`, [], (err, row) => {
        if (err) {
          logger.error('查询用户错误:', err);
          return;
        }
        
        if (!row) {
          // 创建默认管理员账号
          const hashedPassword = bcrypt.hashSync('commander@2023', 10);
          db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
            ['admin', hashedPassword, 'admin'], 
            function(err) {
              if (err) {
                logger.error('创建管理员账号错误:', err);
              } else {
                logger.info('默认管理员账号创建成功');
              }
            });
        }
      });
    });
    
    // 创建内容表 - 支持中英文内容
    db.run(`CREATE TABLE IF NOT EXISTS contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      key TEXT NOT NULL,
      zh_content TEXT,
      en_content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(section, key)
    )`, (err) => {
      if (err) {
        logger.error('创建内容表错误:', err);
      }
    });
    
    // 创建合作伙伴表
    db.run(`CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      zh_name TEXT,
      en_name TEXT,
      logo_url TEXT NOT NULL,
      website_url TEXT,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        logger.error('创建合作伙伴表错误:', err);
        return;
      }
      
      // 初始化基础合作伙伴数据
      db.get(`SELECT COUNT(*) as count FROM partners`, [], (err, row) => {
        if (err) {
          logger.error('查询合作伙伴错误:', err);
          return;
        }
        
        if (row.count === 0) {
          // 初始化默认合作伙伴数据
          const defaultPartners = [
            {
              name: 'Binance',
              zh_name: '币安',
              en_name: 'Binance',
              logo_url: 'https://cdnjs.cloudflare.com/ajax/libs/cryptocurrency-icons/0.18.1/svg/color/bnb.svg',
              website_url: 'https://www.binance.com',
              display_order: 1
            },
            {
              name: 'Victory Securities',
              zh_name: '胜利证券',
              en_name: 'Victory Securities',
              logo_url: 'https://picsum.photos/id/200/120/120',
              website_url: 'https://victory.com',
              display_order: 2
            },
            {
              name: 'SlowMist',
              zh_name: '慢雾',
              en_name: 'SlowMist',
              logo_url: 'https://picsum.photos/id/201/120/120',
              website_url: 'https://slowmist.com',
              display_order: 3
            },
            {
              name: 'DBS Bank',
              zh_name: '星展银行',
              en_name: 'DBS Bank',
              logo_url: 'https://picsum.photos/id/202/120/120',
              website_url: 'https://dbs.com',
              display_order: 4
            }
          ];
          
          const stmt = db.prepare(`INSERT INTO partners (name, zh_name, en_name, logo_url, website_url, display_order) VALUES (?, ?, ?, ?, ?, ?)`);
          
          defaultPartners.forEach(partner => {
            stmt.run([
              partner.name,
              partner.zh_name,
              partner.en_name,
              partner.logo_url,
              partner.website_url,
              partner.display_order
            ], (err) => {
              if (err) {
                logger.error('插入默认合作伙伴错误:', err);
              }
            });
          });
          
          stmt.finalize(() => {
            logger.info('初始化默认合作伙伴完成');
          });
        }
      });
    });
    
    // 创建法律文档表
    db.run(`CREATE TABLE IF NOT EXISTS legal_docs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      zh_content TEXT,
      en_content TEXT,
      doc_type TEXT NOT NULL,
      is_visible BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        logger.error('创建法律文档表错误:', err);
      }
    });
    
    // 创建业务类型表
    db.run(`CREATE TABLE IF NOT EXISTS business_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type_key TEXT UNIQUE NOT NULL,
      zh_name TEXT NOT NULL,
      en_name TEXT NOT NULL,
      zh_description TEXT,
      en_description TEXT,
      icon_url TEXT,
      display_order INTEGER DEFAULT 0
    )`, (err) => {
      if (err) {
        logger.error('创建业务类型表错误:', err);
        return;
      }
      
      // 初始化四大业务类型
      const businessTypes = [
        {
          type_key: 'digital_asset_trading',
          zh_name: '数字资产交易平台',
          en_name: 'Digital Asset Trading Platform',
          zh_description: '含股权代币化，强调NTF非证券化属性',
          en_description: 'Including equity tokenization, emphasizing the non-securities nature of NTF',
          display_order: 1
        },
        {
          type_key: 'rwa_issuance',
          zh_name: 'RWA数字化发行',
          en_name: 'RWA Digital Issuance',
          zh_description: '关联"房地产/私募股权锚定"案例',
          en_description: 'Linking to "real estate/private equity anchoring" cases',
          display_order: 2
        },
        {
          type_key: 'blockchain_payment',
          zh_name: '区块链跨境支付',
          en_name: 'Blockchain Cross-border Payment',
          zh_description: '突出"秒级结算、合规通道"',
          en_description: 'Highlighting "second-level settlement, compliant channels"',
          display_order: 3
        },
        {
          type_key: 'fintech_development',
          zh_name: '数字金融技术开发',
          en_name: 'Digital Financial Technology Development',
          zh_description: '为持牌机构提供白标系统',
          en_description: 'Providing white-label systems for licensed institutions',
          display_order: 4
        }
      ];
      
      db.get(`SELECT COUNT(*) as count FROM business_types`, [], (err, row) => {
        if (err) {
          logger.error('查询业务类型错误:', err);
          return;
        }
        
        if (row.count === 0) {
          // 批量插入业务类型
          const stmt = db.prepare(`INSERT INTO business_types 
            (type_key, zh_name, en_name, zh_description, en_description, display_order) 
            VALUES (?, ?, ?, ?, ?, ?)`);
            
          businessTypes.forEach(type => {
            stmt.run([
              type.type_key,
              type.zh_name,
              type.en_name,
              type.zh_description,
              type.en_description,
              type.display_order
            ]);
          });
          
          stmt.finalize();
          logger.info('初始化业务类型完成');
        }
      });
    });
    
    // 初始化基础内容
    initBaseContents(db);
  });
}

// 初始化基础内容
function initBaseContents(db) {
  const baseContents = [
    {
      section: 'hero',
      key: 'main_title',
      zh_content: '全球真实资产（RWA）流动性解决方案',
      en_content: 'Global Real-World Asset (RWA) Liquidity Solutions'
    },
    {
      section: 'hero',
      key: 'subtitle',
      zh_content: '引领区块链金融创新，连接传统资产与数字世界',
      en_content: 'Leading Blockchain Financial Innovation, Connecting Traditional Assets with the Digital World'
    },
    {
      section: 'company',
      key: 'name',
      zh_content: '司令 (Siling)',
      en_content: 'Commander Capital'
    },
    {
      section: 'company',
      key: 'full_name',
      zh_content: 'Pacific National Blockchain Finance Ltd',
      en_content: 'Pacific National Blockchain Finance Ltd'
    },
    {
      section: 'innovation',
      key: 'ntf_explanation',
      zh_content: 'NTF仅为资产收益权凭证，不构成证券投资',
      en_content: 'NTF is only a certificate of beneficial interest in assets and does not constitute a securities investment'
    },
    {
      section: 'compliance',
      key: 'legal_notice',
      zh_content: '本平台仅服务非居民合格投资者，禁止萨摩亚境内居民参与。NTF不代表股权，不承诺投资收益，用户需自担风险。',
      en_content: 'This platform only serves non-resident qualified investors. Residents of Samoa are prohibited from participating. NTF does not represent equity and does not promise investment returns. Users must bear risks themselves.'
    }
  ];
  
  db.get(`SELECT COUNT(*) as count FROM contents`, [], (err, row) => {
    if (err) {
      logger.error('查询内容表错误:', err);
      return;
    }
    
    if (row.count === 0) {
      const stmt = db.prepare(`INSERT INTO contents (section, key, zh_content, en_content) VALUES (?, ?, ?, ?)`);
      
      baseContents.forEach(content => {
        stmt.run([
          content.section,
          content.key,
          content.zh_content,
          content.en_content
        ]);
      });
      
      stmt.finalize();
      logger.info('初始化基础内容完成');
    }
  });
}

// 初始化数据库
initDatabase();

// 鉴权中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: '未提供访问令牌' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' });
    }
    
    req.user = user;
    next();
  });
}

// 管理员权限检查中间件
function checkAdminRole(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: '需要管理员权限' });
  }
  next();
}

// 登录接口
app.post('/api/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { username, password } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      logger.error('登录查询出错:', err);
      return res.status(500).json({ error: '服务器错误' });
    }
    
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        logger.error('密码比对错误:', err);
        return res.status(500).json({ error: '服务器错误' });
      }
      
      if (!result) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }
      
      // 生成JWT令牌
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    });
    
    db.close();
  });
});

// 获取页面内容
app.get('/api/content', (req, res) => {
  const lang = req.query.lang || 'zh'; // 默认中文
  const contentField = lang === 'en' ? 'en_content' : 'zh_content';
  const nameField = lang === 'en' ? 'en_name' : 'zh_name';
  const descField = lang === 'en' ? 'en_description' : 'zh_description';
  
  const db = new sqlite3.Database(dbPath);
  
  // 获取所有内容
  db.all(`SELECT section, key, ${contentField} as content FROM contents`, [], (err, contents) => {
    if (err) {
      logger.error('获取内容错误:', err);
      return res.status(500).json({ error: '获取内容失败' });
    }
    
    // 获取业务类型
    db.all(`SELECT id, type_key, ${nameField} as name, ${descField} as description, 
      icon_url, display_order FROM business_types ORDER BY display_order`, [], (err, businessTypes) => {
      if (err) {
        logger.error('获取业务类型错误:', err);
        return res.status(500).json({ error: '获取业务类型失败' });
      }
      
      // 获取合作伙伴
      db.all('SELECT id, name, logo_url, website_url FROM partners ORDER BY display_order', [], (err, partners) => {
        if (err) {
          logger.error('获取合作伙伴错误:', err);
          return res.status(500).json({ error: '获取合作伙伴失败' });
        }
        
        // 获取法律文档
        db.all(`SELECT id, title, ${contentField} as content, doc_type 
          FROM legal_docs WHERE is_visible = 1`, [], (err, legalDocs) => {
          if (err) {
            logger.error('获取法律文档错误:', err);
            return res.status(500).json({ error: '获取法律文档失败' });
          }
          
          const result = {
            contents: contents.reduce((acc, item) => {
              if (!acc[item.section]) {
                acc[item.section] = {};
              }
              acc[item.section][item.key] = item.content;
              return acc;
            }, {}),
            businessTypes,
            partners,
            legalDocs,
            domain: 'siling.com',
            company: {
              name: lang === 'en' ? 'Commander Capital' : '司令 (Siling)',
              fullName: 'Pacific National Blockchain Finance Ltd',
              registrationNumber: 'SA12345678'
            }
          };
          
          res.json(result);
          db.close();
        });
      });
    });
  });
});

// 获取合作伙伴列表 - 专用接口
app.get('/api/partners', (req, res) => {
  const lang = req.query.lang || 'zh';
  
  try {
    const db = new sqlite3.Database(dbPath);
    
    db.all(`SELECT 
      id, 
      name,
      zh_name,
      en_name,
      logo_url, 
      website_url, 
      display_order 
      FROM partners 
      ORDER BY display_order ASC, id ASC`, 
      [], 
      (err, rows) => {
        if (err) {
          logger.error('获取合作伙伴列表错误:', err);
          
          // 返回默认合作伙伴数据作为备用
          const defaultPartners = [
            {
              id: 1,
              name: lang === 'en' ? 'Binance' : '币安',
              logo_url: 'https://cdnjs.cloudflare.com/ajax/libs/cryptocurrency-icons/0.18.1/svg/color/bnb.svg',
              website_url: 'https://www.binance.com'
            },
            {
              id: 2,
              name: lang === 'en' ? 'Victory Securities' : '胜利证券',
              logo_url: 'https://picsum.photos/id/200/120/120',
              website_url: 'https://victory.com'
            },
            {
              id: 3,
              name: lang === 'en' ? 'SlowMist' : '慢雾',
              logo_url: 'https://picsum.photos/id/201/120/120',
              website_url: 'https://slowmist.com'
            },
            {
              id: 4,
              name: lang === 'en' ? 'DBS Bank' : '星展银行',
              logo_url: 'https://picsum.photos/id/202/120/120',
              website_url: 'https://dbs.com'
            }
          ];
          
          return res.json({
            success: true,
            data: defaultPartners,
            source: 'fallback'
          });
        }
        
        // 根据语言处理数据
        const partners = rows.map(row => ({
          id: row.id,
          name: lang === 'en' ? (row.en_name || row.name) : (row.zh_name || row.name),
          logo_url: row.logo_url,
          website_url: row.website_url,
          display_order: row.display_order
        }));
        
        res.json({
          success: true,
          data: partners,
          total: partners.length,
          source: 'database'
        });
        
        db.close();
      }
    );
  } catch (error) {
    logger.error('合作伙伴接口异常:', error);
    
    // 异常时返回默认数据
    const defaultPartners = [
      {
        id: 1,
        name: lang === 'en' ? 'Binance' : '币安',
        logo_url: 'https://cdnjs.cloudflare.com/ajax/libs/cryptocurrency-icons/0.18.1/svg/color/bnb.svg',
        website_url: 'https://www.binance.com'
      },
      {
        id: 2,
        name: lang === 'en' ? 'Victory Securities' : '胜利证券',
        logo_url: 'https://picsum.photos/id/200/120/120',
        website_url: 'https://victory.com'
      },
      {
        id: 3,
        name: lang === 'en' ? 'SlowMist' : '慢雾',
        logo_url: 'https://picsum.photos/id/201/120/120',
        website_url: 'https://slowmist.com'
      },
      {
        id: 4,
        name: lang === 'en' ? 'DBS Bank' : '星展银行',
        logo_url: 'https://picsum.photos/id/202/120/120',
        website_url: 'https://dbs.com'
      }
    ];
    
    res.json({
      success: true,
      data: defaultPartners,
      source: 'fallback',
      error: 'Database error occurred'
    });
  }
});

// 更新内容 (需要管理员权限)
app.post('/api/update', authenticateToken, checkAdminRole, [
  body('id').isNumeric().withMessage('ID必须是数字'),
  body('content').isObject().withMessage('content必须是对象')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id, content, type } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  
  try {
    // 根据不同类型更新不同表
    switch (type) {
      case 'content':
        // 更新内容
        db.run(
          `UPDATE contents SET zh_content = ?, en_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [content.zh_content, content.en_content, id],
          function(err) {
            if (err) {
              logger.error('更新内容错误:', err);
              return res.status(500).json({ error: '更新内容失败' });
            }
            
            if (this.changes === 0) {
              return res.status(404).json({ error: '内容不存在' });
            }
            
            res.json({ message: '内容更新成功', id });
          }
        );
        break;
        
      case 'business':
        // 更新业务类型
        db.run(
          `UPDATE business_types SET 
            zh_name = ?, en_name = ?, zh_description = ?, en_description = ?, 
            icon_url = ?, display_order = ? 
            WHERE id = ?`,
          [
            content.zh_name, 
            content.en_name, 
            content.zh_description, 
            content.en_description, 
            content.icon_url, 
            content.display_order,
            id
          ],
          function(err) {
            if (err) {
              logger.error('更新业务类型错误:', err);
              return res.status(500).json({ error: '更新业务类型失败' });
            }
            
            if (this.changes === 0) {
              return res.status(404).json({ error: '业务类型不存在' });
            }
            
            res.json({ message: '业务类型更新成功', id });
          }
        );
        break;
        
      case 'partner':
        // 更新合作伙伴
        db.run(
          `UPDATE partners SET name = ?, zh_name = ?, en_name = ?, logo_url = ?, website_url = ?, display_order = ? WHERE id = ?`,
          [content.name, content.zh_name, content.en_name, content.logo_url, content.website_url, content.display_order, id],
          function(err) {
            if (err) {
              logger.error('更新合作伙伴错误:', err);
              return res.status(500).json({ error: '更新合作伙伴失败' });
            }
            
            if (this.changes === 0) {
              return res.status(404).json({ error: '合作伙伴不存在' });
            }
            
            res.json({ message: '合作伙伴更新成功', id });
          }
        );
        break;
        
      case 'legal':
        // 更新法律文档
        db.run(
          `UPDATE legal_docs SET 
            title = ?, zh_content = ?, en_content = ?, doc_type = ?, 
            is_visible = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
          [
            content.title, 
            content.zh_content, 
            content.en_content, 
            content.doc_type, 
            content.is_visible ? 1 : 0,
            id
          ],
          function(err) {
            if (err) {
              logger.error('更新法律文档错误:', err);
              return res.status(500).json({ error: '更新法律文档失败' });
            }
            
            if (this.changes === 0) {
              return res.status(404).json({ error: '法律文档不存在' });
            }
            
            res.json({ message: '法律文档更新成功', id });
          }
        );
        break;
        
      default:
        res.status(400).json({ error: '不支持的更新类型' });
    }
  } finally {
    db.close();
  }
});

// 创建新内容
app.post('/api/content', authenticateToken, checkAdminRole, [
  body('section').notEmpty().withMessage('section不能为空'),
  body('key').notEmpty().withMessage('key不能为空'),
  body('zh_content').notEmpty().withMessage('中文内容不能为空'),
  body('en_content').notEmpty().withMessage('英文内容不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { section, key, zh_content, en_content } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  db.run(
    `INSERT INTO contents (section, key, zh_content, en_content) VALUES (?, ?, ?, ?)`,
    [section, key, zh_content, en_content],
    function(err) {
      if (err) {
        logger.error('创建内容错误:', err);
        return res.status(500).json({ error: '创建内容失败' });
      }
      
      res.status(201).json({ 
        message: '内容创建成功', 
        id: this.lastID,
        section,
        key
      });
      
      db.close();
    }
  );
});

// 添加合作伙伴
app.post('/api/partners', authenticateToken, checkAdminRole, upload.single('logo'), [
  body('name').notEmpty().withMessage('合作伙伴名称不能为空'),
  body('website_url').optional().isURL().withMessage('网址格式不正确')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, zh_name, en_name, website_url, display_order } = req.body;
  const logo_url = req.file ? `/uploads/${req.file.filename}` : req.body.logo_url;
  
  if (!logo_url) {
    return res.status(400).json({ error: '请提供合作伙伴LOGO' });
  }
  
  const db = new sqlite3.Database(dbPath);
  db.run(
    `INSERT INTO partners (name, zh_name, en_name, logo_url, website_url, display_order) VALUES (?, ?, ?, ?, ?, ?)`,
    [name, zh_name, en_name, logo_url, website_url, display_order || 0],
    function(err) {
      if (err) {
        logger.error('添加合作伙伴错误:', err);
        return res.status(500).json({ error: '添加合作伙伴失败' });
      }
      
      res.status(201).json({
        message: '合作伙伴添加成功',
        id: this.lastID,
        name,
        logo_url,
        website_url
      });
      
      db.close();
    }
  );
});

// 添加法律文档
app.post('/api/legal-docs', authenticateToken, checkAdminRole, [
  body('title').notEmpty().withMessage('文档标题不能为空'),
  body('zh_content').notEmpty().withMessage('中文内容不能为空'),
  body('en_content').notEmpty().withMessage('英文内容不能为空'),
  body('doc_type').notEmpty().withMessage('文档类型不能为空')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { title, zh_content, en_content, doc_type, is_visible } = req.body;
  
  const db = new sqlite3.Database(dbPath);
  db.run(
    `INSERT INTO legal_docs (title, zh_content, en_content, doc_type, is_visible) 
     VALUES (?, ?, ?, ?, ?)`,
    [title, zh_content, en_content, doc_type, is_visible ? 1 : 0],
    function(err) {
      if (err) {
        logger.error('添加法律文档错误:', err);
        return res.status(500).json({ error: '添加法律文档失败' });
      }
      
      res.status(201).json({
        message: '法律文档添加成功',
        id: this.lastID,
        title
      });
      
      db.close();
    }
  );
});

// 删除内容
app.delete('/api/content/:id', authenticateToken, checkAdminRole, (req, res) => {
  const id = req.params.id;
  const type = req.query.type || 'content';
  
  let table;
  switch (type) {
    case 'content':
      table = 'contents';
      break;
    case 'business':
      table = 'business_types';
      break;
    case 'partner':
      table = 'partners';
      break;
    case 'legal':
      table = 'legal_docs';
      break;
    default:
      return res.status(400).json({ error: '不支持的内容类型' });
  }
  
  const db = new sqlite3.Database(dbPath);
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
    if (err) {
      logger.error(`删除${type}错误:`, err);
      return res.status(500).json({ error: `删除${type}失败` });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: '内容不存在' });
    }
    
    res.json({ message: '删除成功', id });
    db.close();
  });
});

// 上传图片
app.post('/api/upload', authenticateToken, checkAdminRole, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择要上传的图片' });
  }
  
  res.json({
    message: '图片上传成功',
    url: `/uploads/${req.file.filename}`
  });
});

// 系统日志接口
app.get('/api/logs', authenticateToken, checkAdminRole, (req, res) => {
  fs.readFile('app.log', 'utf8', (err, data) => {
    if (err) {
      logger.error('读取日志文件错误:', err);
      return res.status(500).json({ error: '获取日志失败' });
    }
    
    try {
      const lines = data.trim().split('\n');
      const logs = lines.map(line => JSON.parse(line));
      res.json(logs);
    } catch (e) {
      logger.error('解析日志错误:', e);
      res.status(500).json({ error: '解析日志失败' });
    }
  });
});

// 获取所有内容类型的列表接口 (用于后台管理)
app.get('/api/admin/contents', authenticateToken, checkAdminRole, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all(`SELECT id, section, key, zh_content, en_content, updated_at FROM contents`, [], (err, rows) => {
    if (err) {
      logger.error('获取内容列表错误:', err);
      return res.status(500).json({ error: '获取内容列表失败' });
    }
    
    res.json(rows);
    db.close();
  });
});

// 获取所有业务类型列表接口 (用于后台管理)
app.get('/api/admin/business-types', authenticateToken, checkAdminRole, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all(`SELECT * FROM business_types ORDER BY display_order`, [], (err, rows) => {
    if (err) {
      logger.error('获取业务类型列表错误:', err);
      return res.status(500).json({ error: '获取业务类型列表失败' });
    }
    
    res.json(rows);
    db.close();
  });
});

// 获取所有合作伙伴列表接口 (用于后台管理)
app.get('/api/admin/partners', authenticateToken, checkAdminRole, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all(`SELECT * FROM partners ORDER BY display_order`, [], (err, rows) => {
    if (err) {
      logger.error('获取合作伙伴列表错误:', err);
      return res.status(500).json({ error: '获取合作伙伴列表失败' });
    }
    
    res.json(rows);
    db.close();
  });
});

// 获取所有法律文档列表接口 (用于后台管理)
app.get('/api/admin/legal-docs', authenticateToken, checkAdminRole, (req, res) => {
  const db = new sqlite3.Database(dbPath);
  db.all(`SELECT * FROM legal_docs`, [], (err, rows) => {
    if (err) {
      logger.error('获取法律文档列表错误:', err);
      return res.status(500).json({ error: '获取法律文档列表失败' });
    }
    
    res.json(rows);
    db.close();
  });
});

// 收集错误日志
app.post('/logs', (req, res) => {
  const { level, message, details } = req.body;
  
  if (!level || !message) {
    return res.status(400).json({ error: '日志级别和信息不能为空' });
  }
  
  logger[level](message, details);
  res.json({ success: true });
});

// 处理前端路由
app.get('*', (req, res) => {
  const filePath = path.join(publicPath, req.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(publicPath, 'index.html'));
  }
});

// 处理404错误
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

const PORT = process.env.PORT || 26986;
app.listen(PORT, () => {
  logger.info(`服务器已启动, 端口: ${PORT}`);
  console.log(`服务器已启动, 端口: ${PORT}`);
});