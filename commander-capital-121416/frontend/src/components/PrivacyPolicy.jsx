import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faCheck, faUser, faExchangeAlt, faServer, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { language } = useContext(LanguageContext);
  const [disclaimer, setDisclaimer] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [content, setContent] = useState('zh');

  // 当语言切换时，触发过渡动画
  useEffect(() => {
    // 先淡出
    setFadeOut(true);
    
    // 然后更改内容
    const timer = setTimeout(() => {
      setContent(language);
      setFadeOut(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [language]);
  
  return (
    <div className="container">
      <div className={`policy-container ${fadeOut ? 'fade-out' : 'fade-in'}`}>
        {content === 'en' ? (
          <>
            <h1>Privacy Policy</h1>
            <p className="policy-date">Last Updated: August 13, 2025</p>
            
            <div className="disclaimer-popup mb-4">
              <input 
                type="checkbox" 
                id="disclaimer-checkbox" 
                checked={disclaimer}
                onChange={() => setDisclaimer(!disclaimer)}
              />
              <label htmlFor="disclaimer-checkbox">
                I have read and acknowledge the NTF Non-Securities Statement. I understand that NTF represents only beneficial interest in assets and does not constitute securities, equity, or investment contracts.
              </label>
            </div>
            
            <p><strong>Scope:</strong> This policy applies to the processing of personal information when users visit siling.com, use the Commander Capital digital asset trading platform (including NTF trading), and related services.</p>
            
            <h2><FontAwesomeIcon icon={faUser} className="me-2" /> I. Information Collection Scope</h2>
            
            <h3>Essential Information</h3>
            <ul>
              <li><strong>Identity Verification:</strong> Name, ID number (qualified investors only), contact information (email/phone number)</li>
              <li><strong>Transaction Data:</strong> Wallet address, transaction records, NTF holdings, stable coin deposits/withdrawals (automatically recorded through the blockchain system)</li>
              <li><strong>Device Information:</strong> IP address, device model, operating system version (for anti-fraud and risk control)</li>
            </ul>
            
            <h3>Non-Essential Information</h3>
            <ul>
              <li><strong>User-Submitted Data:</strong> KYC supplementary materials (such as income proof), customer service inquiries</li>
              <li><strong>Third-Party Data:</strong> Asset proof provided by partner brokers (used only for qualified investor certification)</li>
            </ul>
            
            <h2><FontAwesomeIcon icon={faExchangeAlt} className="me-2" /> II. Information Usage Purposes & Legal Basis</h2>
            
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Usage Scenario</th>
                  <th>Data Type</th>
                  <th>Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NTF Trading Eligibility Review</td>
                  <td>Identity Information, Asset Proof</td>
                  <td>Fulfillment of Contractual Obligations (Article X of Samoa Financial Regulatory Ordinance)</td>
                </tr>
                <tr>
                  <td>On-Chain Transaction Execution & Settlement</td>
                  <td>Wallet Address, Transaction Records</td>
                  <td>Necessity for Core Platform Functionality</td>
                </tr>
                <tr>
                  <td>Data Submission to Regulatory Bodies (Samoa FMA)</td>
                  <td>Anonymized Transaction Flows</td>
                  <td>Legal Compliance Obligations</td>
                </tr>
                <tr>
                  <td>Anti-Money Laundering (AML) Monitoring</td>
                  <td>IP Address, Device Information</td>
                  <td>Public Interest and Legal Requirements</td>
                </tr>
              </tbody>
            </table>
            
            <h2><FontAwesomeIcon icon={faShield} className="me-2" /> III. User Rights & Data Control</h2>
            
            <h3>Key Responsibility</h3>
            <p>Users are responsible for safeguarding their private keys/mnemonics. The platform does not store these and cannot assist in recovery.</p>
            
            <h3>Data Query/Deletion</h3>
            <ul>
              <li>Export transaction history through [Account Settings] (on-chain data cannot be deleted due to the immutable nature of blockchain)</li>
              <li>Non-chain information (such as KYC materials) can be requested for deletion</li>
            </ul>
            
            <h3>Cross-border Transfers</h3>
            <p>Data is stored on servers in Samoa, with partial backups in Singapore (in compliance with Protege Bank custody agreement).</p>
            
            <h2><FontAwesomeIcon icon={faGlobe} className="me-2" /> IV. Third-Party Services & Disclaimer</h2>
            
            <h3>Chainlink</h3>
            <p>Public reserve proof data does not involve user identity.</p>
            
            <h3>Third-Party DApps</h3>
            <p>When redirected to external DApps (such as cross-border payment interfaces), the privacy policy of that DApp applies.</p>
          </>
        ) : (
          <>
            <h1>隐私政策</h1>
            <p className="policy-date">最后更新日期：2025年8月13日</p>
            
            <div className="disclaimer-popup mb-4">
              <input 
                type="checkbox" 
                id="disclaimer-checkbox" 
                checked={disclaimer}
                onChange={() => setDisclaimer(!disclaimer)}
              />
              <label htmlFor="disclaimer-checkbox">
                我已阅读并确认NTF非证券声明。我理解NTF仅代表资产收益权凭证，不构成证券、股权或投资合同。
              </label>
            </div>
            
            <p><strong>适用范围：</strong>本政策适用于用户访问siling.com、使用Commander Capital数字资产交易平台（含NTF交易）及关联服务时的个人信息处理。</p>
            
            <h2><FontAwesomeIcon icon={faUser} className="me-2" /> 一、信息收集范围</h2>
            
            <h3>必要信息</h3>
            <ul>
              <li><strong>身份验证：</strong>姓名、证件号（仅限合格投资者）、联系方式（邮箱/手机号）</li>
              <li><strong>交易数据：</strong>钱包地址、交易记录、NTF持有情况、稳定币充值/提现记录（通过区块链系统自动记录）</li>
              <li><strong>设备信息：</strong>IP地址、设备型号、操作系统版本（用于反欺诈及风控）</li>
            </ul>
            
            <h3>非必要信息</h3>
            <ul>
              <li><strong>用户自主提交：</strong>KYC补充材料（如收入证明）、客户服务咨询内容</li>
              <li><strong>第三方数据：</strong>合作券商提供的资产证明（仅用于合格投资者认证）</li>
            </ul>
            
            <h2><FontAwesomeIcon icon={faExchangeAlt} className="me-2" /> 二、信息使用目的与法律依据</h2>
            
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>使用场景</th>
                  <th>数据类型</th>
                  <th>法律依据</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>NTF交易资格审核</td>
                  <td>身份信息、资产证明</td>
                  <td>履行合同义务（《萨摩亚金融监管条例》第X条）</td>
                </tr>
                <tr>
                  <td>链上交易执行与结算</td>
                  <td>钱包地址、交易记录</td>
                  <td>平台核心功能必要性</td>
                </tr>
                <tr>
                  <td>向监管机构（萨摩亚FMA）报送数据</td>
                  <td>脱敏交易流水</td>
                  <td>法律合规义务</td>
                </tr>
                <tr>
                  <td>反洗钱（AML）监测</td>
                  <td>IP地址、设备信息</td>
                  <td>公共利益及法律要求</td>
                </tr>
              </tbody>
            </table>
            
            <h2><FontAwesomeIcon icon={faShield} className="me-2" /> 三、用户权利与数据控制</h2>
            
            <h3>密钥责任</h3>
            <p>用户需自行保管私钥/助记词，平台不存储且无法协助找回。</p>
            
            <h3>数据查询/删除</h3>
            <ul>
              <li>通过【账户设置】导出交易历史（链上数据不可删除，因区块链不可篡改特性）</li>
              <li>非链上信息（如KYC材料）可申请删除</li>
            </ul>
            
            <h3>跨境传输</h3>
            <p>数据存储于萨摩亚服务器，部分备份在新加坡（符合Protege银行托管协议）。</p>
            
            <h2><FontAwesomeIcon icon={faGlobe} className="me-2" /> 四、第三方服务与免责</h2>
            
            <h3>Chainlink</h3>
            <p>公开储备金证明数据，不涉及用户身份。</p>
            
            <h3>第三方DApp</h3>
            <p>跳转至外部DApp（如跨境支付接口）后，适用该DApp隐私政策。</p>
          </>
        )}
      </div>
      
      <div className="compliance-alert">
        ▶ 您正在访问Pacific National Blockchain Finance Ltd（萨摩亚注册编号XXXX）服务，禁止境内居民使用。NTF非证券产品，详情见<a href="#disclaimer">免责声明</a>。
      </div>
    </div>
  );
};

export default PrivacyPolicy;