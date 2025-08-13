import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faHandshake, faShieldAlt, faExclamationTriangle, faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { LanguageContext } from '../contexts/LanguageContext';

const TermsOfUse = () => {
  const { language } = useContext(LanguageContext);
  const [accepted, setAccepted] = useState(false);

  const handleCheckboxChange = (e) => {
    setAccepted(e.target.checked);
  };

  return (
    <div className="policy-container">
      {language === 'en' ? (
        <>
          <h1><FontAwesomeIcon icon={faGavel} className="me-2" /> Terms of Use</h1>
          <p className="policy-date">Effective Date: August 13, 2025</p>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faHandshake} className="me-2" /> I. Service Scope Limitations</h2>
            
            <h3>Qualified Investor Access</h3>
            <p>Limited to institutional/individual users with net assets ≥$1 million or annual income ≥$200,000;</p>
            <p>Residents of Samoa are prohibited from accessing (automatically blocked by geo-fencing technology).</p>
            
            <h3>NTF Legal Classification Statement</h3>
            <p>NTF (Non-Tokenized Fractions) are <span className="highlight">certificates of beneficial interest in underlying assets</span>, and do not constitute securities, equity or investment contracts. User returns obtained through NTF derive from asset appreciation dividends, and the platform makes no promises of investment returns.</p>
          </section>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faShieldAlt} className="me-2" /> II. User Obligations and Prohibited Behavior</h2>
            
            <h3>Compliant Trading</h3>
            <p>✅ Permitted: Using USDT to purchase NTFs anchored to listed company stocks;</p>
            <p>❌ Prohibited: Using the platform for money laundering, market manipulation or distributing malicious smart contracts;</p>
            
            <h3>Account Security</h3>
            <p>In case of abnormal transactions, the account should be frozen immediately and reported via email to compliance@siling.com.</p>
          </section>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> III. Disclaimer and Risk Notice</h2>
            
            <h3>Technical Risks</h3>
            <p>The platform assumes no responsibility for transaction delays due to blockchain forks or network congestion;</p>
            
            <h3>Policy Risks</h3>
            <p>If Samoa's "Digital Asset Sandbox Regulatory Ordinance" fails to pass, the business will be relocated to the UAE RAK ICC entity.</p>
          </section>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faBalanceScale} className="me-2" /> IV. Dispute Resolution and Applicable Law</h2>
            
            <h3>Governing Law</h3>
            <p><span className="highlight-danger">Samoan law applies (UAE RAK ICC law applies to users outside Samoa);</span></p>
            
            <h3>Arbitration Clause</h3>
            <p>Disputes must be submitted to the Samoa International Arbitration Center (SIAC), waiving the right to jury trial.</p>
          </section>
          
          <div className="disclaimer-popup">
            <input 
              type="checkbox" 
              id="disclaimer-checkbox" 
              checked={accepted}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="disclaimer-checkbox">
              I have read and agree to the Terms of Use and understand that NTFs are not securities
            </label>
          </div>
        </>
      ) : (
        <>
          <h1><FontAwesomeIcon icon={faGavel} className="me-2" /> 使用条款</h1>
          <p className="policy-date">生效日期：2025年8月13日</p>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faHandshake} className="me-2" /> 一、服务范围限定</h2>
            
            <h3>合格投资者准入</h3>
            <p>仅限净资产≥100万美元或年收入≥20万美元的机构/个人用户；</p>
            <p>萨摩亚境内居民禁止访问（地理围栏技术自动屏蔽）。</p>
            
            <h3>NTF法律属性声明</h3>
            <p>NTF（Non-Tokenized Fractions）为<span className="highlight">底层资产收益权凭证</span>，不构成证券、股权或投资合同。用户通过NTF获取的收益源于资产增值分红，平台不承诺投资回报。</p>
          </section>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faShieldAlt} className="me-2" /> 二、用户义务与禁止行为</h2>
            
            <h3>合规交易</h3>
            <p>✅ 允许：使用USDT购买锚定上市公司股票的NTF；</p>
            <p>❌ 禁止：利用平台洗钱、操纵市场或传播恶意智能合约；</p>
            
            <h3>账户安全</h3>
            <p>如发现异常交易，需立即冻结账户并邮件报告 compliance@siling.com。</p>
          </section>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faExclamationTriangle} className="me-2" /> 三、责任豁免与风险提示</h2>
            
            <h3>技术风险</h3>
            <p>因区块链分叉、网络拥堵导致的交易延迟，平台不承担责任；</p>
            
            <h3>政策风险</h3>
            <p>若萨摩亚《数字资产沙盒监管条例》立法未通过，业务将迁移至阿联酋RAK ICC实体。</p>
          </section>

          <section className="bilingual-section">
            <h2><FontAwesomeIcon icon={faBalanceScale} className="me-2" /> 四、争议解决与法律适用</h2>
            
            <h3>管辖法律</h3>
            <p><span className="highlight-danger">萨摩亚法律（境外用户适用阿联酋RAK ICC法律）；</span></p>
            
            <h3>仲裁条款</h3>
            <p>争议需提交萨摩亚国际仲裁中心（SIAC），放弃陪审团审判权。</p>
          </section>
          
          <div className="disclaimer-popup">
            <input 
              type="checkbox" 
              id="disclaimer-checkbox" 
              checked={accepted}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="disclaimer-checkbox">
              我已阅读并同意使用条款，并了解NTF不属于证券产品
            </label>
          </div>
        </>
      )}

      <div className="compliance-alert">
        ▶ {language === 'en' ? 
          'You are accessing services of Pacific National Blockchain Finance Ltd (Samoa Registration No. XXXX), prohibited for residents of Samoa. NTFs are not securities products, see ' : 
          '您正在访问Pacific National Blockchain Finance Ltd（萨摩亚注册编号XXXX）服务，禁止境内居民使用。NTF非证券产品，详情见'}
        <a href="#disclaimer">{language === 'en' ? 'disclaimer' : '免责声明'}</a>.
      </div>
    </div>
  );
};

export default TermsOfUse;