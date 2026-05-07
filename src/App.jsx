import { useState } from "react";

// ============================================================
//  이메일 설정 (EmailJS — emailjs.com에서 발급)
// ============================================================
const EMAILJS_SERVICE_ID  = "service_mgnsg16";   // 예: service_abc123
const EMAILJS_TEMPLATE_ID = "template_x3ttayt";  // 예: template_xyz789
const EMAILJS_PUBLIC_KEY  = "dpDL8IISDiISmRNJE";   // 예: aBcDeFgHiJkLmNoP
const RECIPIENT_EMAIL     = "info@jungedu.com.au";
// ============================================================

const STEPS = [
  { id: 1, label: "신청 개요" },
  { id: 2, label: "개인정보" },
  { id: 3, label: "여권/신분증" },
  { id: 4, label: "건강/동반가족" },
  { id: 5, label: "연락처" },
  { id: 6, label: "가족구성" },
  { id: 7, label: "재정/보험" },
  { id: 8, label: "학력/경력" },
  { id: 9, label: "언어/여행" },
  { id: 10, label: "선언/확인" },
];

const COLORS = { navy: "#1e3a8a", blue: "#3b82f6", light: "#eff6ff", border: "#dbeafe", muted: "#64748b", danger: "#ef4444", success: "#22c55e" };

const css = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Noto Sans KR',system-ui,sans-serif;background:#f0f4f8;color:#1e293b}
input,select,textarea{width:100%;padding:10px 13px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:14px;font-family:inherit;color:#1e293b;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s}
input:focus,select:focus,textarea:focus{border-color:#1e3a8a;box-shadow:0 0 0 3px rgba(30,58,138,.08)}
select{cursor:pointer;-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px}
button{cursor:pointer;font-family:inherit;transition:all .2s;border:none}
button:hover{opacity:.9;transform:translateY(-1px)}
button:active{transform:translateY(0)}
.btn-primary{background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#fff;border-radius:10px;padding:13px 24px;font-size:15px;font-weight:700}
.btn-secondary{background:#fff;color:#475569;border:1.5px solid #e2e8f0;border-radius:10px;padding:13px 24px;font-size:15px;font-weight:500}
.btn-ghost{background:transparent;color:#1e3a8a;border:1.5px solid #bfdbfe;border-radius:7px;padding:6px 12px;font-size:13px}
.btn-danger{background:#fef2f2;color:#dc2626;border:1px solid #fecaca;border-radius:7px;padding:5px 10px;font-size:12px}
.card{background:#fff;border-radius:14px;border:1.5px solid #e2e8f0;padding:24px}
.section-title{display:flex;align-items:center;gap:10px;margin-bottom:18px;padding-bottom:14px;border-bottom:1.5px solid #f1f5f9}
.tag{display:inline-block;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700;letter-spacing:.04em}
.tag-blue{background:#dbeafe;color:#1e40af}
.tag-green{background:#dcfce7;color:#15803d}
.row{display:grid;gap:12px}
.row-2{grid-template-columns:1fr 1fr}
.row-3{grid-template-columns:1fr 1fr 1fr}
.row-4{grid-template-columns:1fr 1fr 1fr 1fr}
.field{margin-bottom:14px}
.field label{display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;letter-spacing:.02em}
.required{color:#ef4444}
.sub-card{background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:12px}
.sub-card-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.hint{font-size:12px;color:#64748b;margin-top:4px;line-height:1.5}
.decl-item{display:flex;align-items:flex-start;gap:12px;padding:12px;border:1.5px solid #e2e8f0;border-radius:8px;margin-bottom:8px;cursor:pointer;transition:border-color .2s,background .2s}
.decl-item:hover{border-color:#93c5fd;background:#f0f9ff}
.decl-item input[type=checkbox]{width:18px;height:18px;flex-shrink:0;margin-top:1px;cursor:pointer;accent-color:#1e3a8a}
.decl-item label{font-size:13px;color:#374151;line-height:1.6;cursor:pointer}
.error-box{background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;color:#dc2626;font-size:13px;margin-top:8px}
.success-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;color:#15803d;font-size:13px}
`;

// Helper components
const F = ({ label, required, children, hint }) => (
  <div className="field">
    <label>{label}{required && <span className="required"> *</span>}</label>
    {children}
    {hint && <p className="hint">{hint}</p>}
  </div>
);

const I = ({ label, value, onChange, type = "text", placeholder, required, hint }) => (
  <F label={label} required={required} hint={hint}>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
  </F>
);

const S = ({ label, value, onChange, options, required, hint }) => (
  <F label={label} required={required} hint={hint}>
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">선택하세요...</option>
      {options.map(o => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
    </select>
  </F>
);

const YN = ({ label, value, onChange, required, hint }) => (
  <F label={label} required={required} hint={hint}>
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">선택하세요...</option>
      <option value="Yes">예 (Yes)</option>
      <option value="No">아니요 (No)</option>
    </select>
  </F>
);

const T = ({ label, value, onChange, placeholder, rows = 3, hint }) => (
  <F label={label} hint={hint}>
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ resize: "vertical" }} />
  </F>
);

const SecTitle = ({ icon, title }) => (
  <div className="section-title">
    <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#1e3a8a,#3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff" }}>{icon}</div>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{title}</h3>
  </div>
);

const AddBtn = ({ onClick, label }) => (
  <button className="btn-ghost" onClick={onClick} style={{ marginTop: 8 }}>＋ {label}</button>
);

const PassportFields = ({ data, set, prefix = "" }) => (
  <>
    <div className="row row-2">
      <I label="성(Family Name)" value={data.familyName} onChange={set("familyName")} placeholder="KI" required />
      <I label="이름(Given Names)" value={data.givenNames} onChange={set("givenNames")} placeholder="HYUN" required />
    </div>
    <div className="row row-3">
      <S label="성별(Sex)" value={data.sex} onChange={set("sex")} options={[{ v: "Male", l: "남성(Male)" }, { v: "Female", l: "여성(Female)" }, { v: "Other", l: "기타(Other)" }]} required />
      <I label="생년월일(Date of Birth)" value={data.dob} onChange={set("dob")} type="date" required />
      <I label="여권번호(Passport Number)" value={data.passportNo} onChange={set("passportNo")} placeholder="M677J1111" required />
    </div>
    <div className="row row-2">
      <S label="여권 발급국(Country of Passport)" value={data.passportCountry} onChange={set("passportCountry")} options={["KOREA, REPUBLIC OF (SOUTH)", "AUSTRALIA", "CHINA", "JAPAN", "OTHER"]} required />
      <S label="국적(Nationality)" value={data.nationality} onChange={set("nationality")} options={["KOREA, REPUBLIC OF (SOUTH)", "AUSTRALIAN", "CHINESE", "JAPANESE", "OTHER"]} required />
    </div>
    <div className="row row-3">
      <I label="발급일(Date of Issue)" value={data.issueDate} onChange={set("issueDate")} type="date" required />
      <I label="만료일(Date of Expiry)" value={data.expiry} onChange={set("expiry")} type="date" required />
      <I label="발급기관(Issuing Authority)" value={data.issuer} onChange={set("issuer")} placeholder="MINISTRY OF FOREIGN AFFAIRS" />
    </div>
  </>
);

const NationalIdFields = ({ data, set }) => (
  <div className="sub-card">
    <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>신분증 정보 (National Identity Card)</p>
    <div className="row row-2">
      <I label="성(Family Name)" value={data.idFamilyName} onChange={set("idFamilyName")} placeholder="KIM" />
      <I label="이름(Given Names)" value={data.idGivenNames} onChange={set("idGivenNames")} placeholder="HYUNG" />
    </div>
    <div className="row row-2">
      <I label="신분증 번호(Identification Number)" value={data.idNumber} onChange={set("idNumber")} placeholder="9908221111111" />
      <S label="발급국(Country of Issue)" value={data.idCountry} onChange={set("idCountry")} options={["KOREA, SOUTH", "AUSTRALIA", "CHINA", "JAPAN", "OTHER"]} />
    </div>
    <div className="row row-2">
      <I label="발급일(Date of Issue) — 없으면 공란" value={data.idIssueDate} onChange={set("idIssueDate")} type="date" />
      <I label="만료일(Date of Expiry) — 없으면 공란" value={data.idExpiry} onChange={set("idExpiry")} type="date" />
    </div>
  </div>
);

const BirthFields = ({ data, set }) => (
  <div className="row row-3">
    <I label="출생 도시(Town/City)" value={data.birthTown} onChange={set("birthTown")} placeholder="Pohang-si" />
    <I label="출생 주/도(State/Province)" value={data.birthState} onChange={set("birthState")} placeholder="Gyeongsangbuk-do" />
    <S label="출생 국가(Country of Birth)" value={data.birthCountry} onChange={set("birthCountry")} options={["KOREA, SOUTH", "AUSTRALIA", "CHINA", "JAPAN", "OTHER"]} required />
  </div>
);

const blankCoe = () => ({ code: "", isContinuation: "" });
const blankFamily = () => ({ relationship: "", familyName: "", givenNames: "", sex: "", dob: "", passportNo: "", passportCountry: "", nationality: "", issueDate: "", expiry: "", issuer: "", hasNationalId: "", idFamilyName: "", idGivenNames: "", idNumber: "", idCountry: "", idIssueDate: "", idExpiry: "", birthTown: "", birthState: "", birthCountry: "", relStatus: "", hasOtherNames: "", citizenOfPassport: "", citizenOther: "", hasOtherPassports: "", hasOtherIdDocs: "", hasAusVisa: "", ausVisaNumber: "", hadHealthExam: "", isChild: "" });
const blankOtherFamily = () => ({ relationship: "", familyName: "", givenNames: "", sex: "", dob: "", countryOfResidence: "" });
const blankEdu = () => ({ qualification: "", category: "", field: "", courseName: "", institution: "", country: "", dateFrom: "", dateTo: "" });
const blankEmp = () => ({ status: "", isCurrent: "", orgName: "", industry: "", country: "", address: "", city: "", state: "", postcode: "", contactFamily: "", contactGiven: "", contactPhone: "", position: "", dateFrom: "", dateTo: "" });
const blankTravel = () => ({ personName: "", country: "", dateFrom: "", dateTo: "", reason: "" });

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // ── Step 1: Application Context
  const [ctx, setCtx] = useState({ currentLocation: "AUSTRALIA", outsideAustraliaCountry: "", firstTime: "" });
  const [coes, setCoes] = useState([blankCoe()]);

  // ── Step 2: Primary Applicant Personal
  const [personal, setPersonal] = useState({ familyName: "", givenNames: "", sex: "", dob: "", relStatus: "", hasOtherNames: "", citizenOfPassport: "Yes", citizenOther: "", hasOtherPassports: "", hasOtherIdDocs: "" });

  // ── Step 3: Passport & ID
  const [passport, setPassport] = useState({ passportNo: "", passportCountry: "", nationality: "", issueDate: "", expiry: "", issuer: "", hasNationalId: "", idFamilyName: "", idGivenNames: "", idNumber: "", idCountry: "", idIssueDate: "", idExpiry: "", birthTown: "", birthState: "", birthCountry: "" });

  // ── Step 4: Health & Accompanying Family
  const [health, setHealth] = useState({ hadHealthExam: "", hapId: "", hasAccompanying: "" });
  const [accompanying, setAccompanying] = useState([blankFamily()]);

  // ── Step 5: Contact Details
  const [contact, setContact] = useState({ countryOfResidence: "", office: "Australia, Adelaide Regional Office", resCountry: "", resAddress: "", resCity: "", resState: "", resPostcode: "", samePostal: "", postCountry: "", postAddress: "", postCity: "", postState: "", postPostcode: "", homePhone: "", businessPhone: "", mobilePhone: "", email: "", hasAuthRecipient: "", authType: "", authFamilyName: "", authGivenNames: "", authOrg: "", authCountry: "", authAddress: "", authCity: "", authState: "", authPostcode: "", authBusinessPhone: "", authMobile: "", authEmail: "" });

  // ── Step 6: Non-Accompanying & Other Family
  const [fam, setFam] = useState({ hasNonAccompanying: "", hasOtherFamily: "" });
  const [otherFamily, setOtherFamily] = useState([blankOtherFamily()]);

  // ── Step 7: Genuine Student & Funding & OSHC
  const [funding, setFunding] = useState({ confirmedFunds: "", fundingFromIndividual: "", fundingRelationship: "", fundingType: "", fundingAmount: "", fundingInstitution: "", fundingOwnName: "", fundingAccessDetails: "", hasOshc: "", oshcByProvider: "", oshcInsurer: "", oshcPolicy: "", oshcFrom: "", oshcTo: "", familySameOshc: "", famOshcInsurer: "", famOshcPolicy: "", famOshcFrom: "", famOshcTo: "" });
  const [genuine, setGenuine] = useState({ circumstances: "", whyStudy: "", benefit: "", otherInfo: "", currentVisaReason: "" });

  // ── Step 8: Education & Employment
  const [edu, setEdu] = useState({ highestSchooling: "", schoolingCourse: "", schoolingInstitution: "", schoolingCountry: "", hasOtherStudies: "", studiedInAustralia: "", ausStudySchool: "", ausStudySubject: "", ausStudyPeriod: "" });
  const [eduHistory, setEduHistory] = useState([blankEdu()]);
  const [empHistory, setEmpHistory] = useState([blankEmp()]);
  const [futureEmp, setFutureEmp] = useState({ hasJobOffer: "", details: "" });

  // ── Step 9: Language & Travel & Visa History
  const [lang, setLang] = useState({ hasElicos: "", hasEnglishTest: "", mainLanguage: "", hasEnglishStudy: "", hasSeniorSecondary: "", hasAQF: "", famMainLanguage: "" });
  const [hasVisited, setHasVisited] = useState("");
  const [travels, setTravels] = useState([blankTravel()]);
  const [visaHist, setVisaHist] = useState({ details: "", hasNotComplied: "", hasBeenRefused: "" });

  // ── Step 10: Declarations
  const [healthDecl, setHealthDecl] = useState({ livedOutside: "", intendHospital: "", intendHealthWorker: "", intendAgedCare: "", intendChildCare: "", tuberculosis: "", medicalCosts: "", requiresOngoingCare: "" });
  const [charDecl, setCharDecl] = useState({ pending: "", convicted: "", domesticViolence: "", arrestWarrant: "", sexualOffenceChild: "", sexRegister: "", acquitted: "", unfitToPlea: "", nationalSecurity: "", warCrimes: "", associatedCriminals: "", associatedViolence: "", militaryService: "", militaryServiceDetails: "", militaryTraining: "", militaryTrainingDetails: "", peopleSmuggling: "", deported: "", overstayed: "", outstandingDebts: "" });
  const [studentDecl, setStudentDecl] = useState({ readStudyAustralia: false, healthInsurance: false, genuineStudent: false, understandTemp: false, understandDepart: false, understandConditions: false, understand8534: false, understand8534Effect: false, understand8535: false, understand8535Effect: false });
  const [generalDecl, setGeneralDecl] = useState({ readUnderstood: false, completeCorrect: false, understandFraud: false, understandCancellation: false, notIncluded: false, notifyChanges: false, privacyNotice: false, consentData: false, consentFingerprints: false, consentBiometric: false, consentLawEnforcement: false, consentDataUse: false, unlawful: false, australianValues: false });

  const setCtxF = f => v => setCtx(p => ({ ...p, [f]: v }));
  const setPersonalF = f => v => setPersonal(p => ({ ...p, [f]: v }));
  const setPassportF = f => v => setPassport(p => ({ ...p, [f]: v }));
  const setHealthF = f => v => setHealth(p => ({ ...p, [f]: v }));
  const setContactF = f => v => setContact(p => ({ ...p, [f]: v }));
  const setFamF = f => v => setFam(p => ({ ...p, [f]: v }));
  const setFundingF = f => v => setFunding(p => ({ ...p, [f]: v }));
  const setGenuineF = f => v => setGenuine(p => ({ ...p, [f]: v }));
  const setEduF = f => v => setEdu(p => ({ ...p, [f]: v }));
  const setLangF = f => v => setLang(p => ({ ...p, [f]: v }));
  const setFutureEmpF = f => v => setFutureEmp(p => ({ ...p, [f]: v }));
  const setVisaF = f => v => setVisaHist(p => ({ ...p, [f]: v }));
  const setHealthDeclF = f => v => setHealthDecl(p => ({ ...p, [f]: v }));
  const setCharDeclF = f => v => setCharDecl(p => ({ ...p, [f]: v }));

  const updateArr = (arr, setArr, idx, field, val) => {
    const next = arr.map((item, i) => i === idx ? { ...item, [field]: val } : item);
    setArr(next);
  };
  const addArr = (arr, setArr, blank) => setArr([...arr, blank()]);
  const removeArr = (arr, setArr, idx) => setArr(arr.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    const allDecls = Object.values(studentDecl).every(Boolean) && Object.values(generalDecl).every(Boolean);
    if (!allDecls) { setError("모든 선언 항목에 체크해 주세요."); return; }
    setLoading(true); setError("");
    try {
      const body = `
■ 신청 개요
현재 위치: ${ctx.currentLocation}${ctx.currentLocation === "OUTSIDE_AUSTRALIA" ? ` (${ctx.outsideAustraliaCountry})` : ""}
최초 학생비자 신청: ${ctx.firstTime}

■ 주 신청인 개인정보
성명: ${personal.familyName}, ${personal.givenNames}
성별: ${personal.sex}
생년월일: ${personal.dob}
관계 상태: ${personal.relStatus}
타 이름 사용 여부: ${personal.hasOtherNames}
다른 국가 시민권: ${personal.citizenOther}

■ 여권 정보
여권번호: ${passport.passportNo}
여권 발급국: ${passport.passportCountry}
국적: ${passport.nationality}
발급일: ${passport.issueDate} / 만료일: ${passport.expiry}
발급기관: ${passport.issuer}
신분증 보유: ${passport.hasNationalId}${passport.hasNationalId === "Yes" ? `\n신분증 번호: ${passport.idNumber} (${passport.idCountry})` : ""}
출생지: ${passport.birthTown}, ${passport.birthState}, ${passport.birthCountry}

■ 건강검진
최근 12개월 내 건강검진: ${health.hadHealthExam}${health.hadHealthExam === "Yes" ? `\nHAP ID: ${health.hapId}` : ""}

■ 동반 가족
동반가족 포함: ${health.hasAccompanying}${health.hasAccompanying === "Yes" ? accompanying.map((m, i) => `\n동반가족 ${i + 1}: ${m.relationship} — ${m.familyName}, ${m.givenNames} (${m.dob}) / 여권: ${m.passportNo}`).join("") : ""}

■ 연락처
거주국: ${contact.countryOfResidence}
관할 사무소: ${contact.office}
거주지: ${contact.resAddress}, ${contact.resCity}, ${contact.resState} ${contact.resPostcode}, ${contact.resCountry}
우편지 동일: ${contact.samePostal}${contact.samePostal === "No" ? `\n우편주소: ${contact.postAddress}, ${contact.postCity}, ${contact.postState} ${contact.postPostcode}, ${contact.postCountry}` : ""}
전화: ${contact.mobilePhone || contact.homePhone || contact.businessPhone}
이메일: ${contact.email}

■ 가족 구성
비동반 가족: ${fam.hasNonAccompanying}
기타 가족 (부모/형제): ${fam.hasOtherFamily}${fam.hasOtherFamily === "Yes" ? otherFamily.map((m, i) => `\n가족 ${i + 1}: ${m.relationship} — ${m.familyName}, ${m.givenNames} (${m.dob}) / 거주국: ${m.countryOfResidence}`).join("") : ""}

■ 재정 지원
충분한 자금 확인: ${funding.confirmedFunds}
개인 재정 지원: ${funding.fundingFromIndividual}${funding.fundingFromIndividual === "Yes" ? `\n지원자 관계: ${funding.fundingRelationship}\n자금 유형: ${funding.fundingType}\n금액(AUD): ${funding.fundingAmount}\n금융기관: ${funding.fundingInstitution}\n접근 방법: ${funding.fundingAccessDetails}` : ""}

■ 학력
최고 학력: ${edu.highestSchooling} (${edu.schoolingCourse} / ${edu.schoolingInstitution}, ${edu.schoolingCountry})
호주 외 추가 학력: ${edu.hasOtherStudies}${edu.hasOtherStudies === "Yes" ? eduHistory.map((e, i) => `\n학력 ${i + 1}: ${e.qualification} | ${e.courseName} | ${e.institution}, ${e.country} (${e.dateFrom}~${e.dateTo})`).join("") : ""}
호주 내 학업 이력: ${edu.studiedInAustralia}${edu.studiedInAustralia === "Yes" ? `\n학교명: ${edu.ausStudySchool}\n과목명: ${edu.ausStudySubject}\n기간: ${edu.ausStudyPeriod}` : ""}

■ 취업 이력
${empHistory.map((e, i) => `취업 ${i + 1}: ${e.status} | ${e.position} @ ${e.orgName} (${e.country}) / ${e.dateFrom}~${e.dateTo}`).join("\n")}
코스 완료 후 취업 제안: ${futureEmp.hasJobOffer}
취업 계획: ${futureEmp.details}

■ 언어
ELICOS 수강/완료: ${lang.hasElicos}
영어 시험 (24개월 내): ${lang.hasEnglishTest}
주 사용 언어: ${lang.mainLanguage}
동반가족 주 사용 언어: ${lang.famMainLanguage}

■ 방문 국가 (최근 10년)
방문 이력: ${hasVisited}${hasVisited === "Yes" ? travels.map((t, i) => `\n방문 ${i + 1}: ${t.personName} — ${t.country} (${t.dateFrom}~${t.dateTo}) / 이유: ${t.reason}`).join("") : ""}

■ 비자 이력
${visaHist.details}
비자 조건 미준수 이력: ${visaHist.hasNotComplied}
비자 거절/취소 이력: ${visaHist.hasBeenRefused}

■ 건강 신고
5년 내 3개월+ 해외 거주: ${healthDecl.livedOutside}
병원 입원 예정: ${healthDecl.intendHospital}
의료 종사자/학생: ${healthDecl.intendHealthWorker}
노인/장애인 케어: ${healthDecl.intendAgedCare}
보육/유치원 근무: ${healthDecl.intendChildCare}
결핵 관련: ${healthDecl.tuberculosis}
의료비 예상: ${healthDecl.medicalCosts}
지속적 의료 필요: ${healthDecl.requiresOngoingCare}

■ 인성 선언
미결 혐의: ${charDecl.pending}
유죄 판결: ${charDecl.convicted}
가정폭력 명령: ${charDecl.domesticViolence}
체포 영장: ${charDecl.arrestWarrant}
아동 성범죄: ${charDecl.sexualOffenceChild}
성범죄자 등록: ${charDecl.sexRegister}
병역 이력: ${charDecl.militaryService}${charDecl.militaryService === "Yes" ? `\n병역 상세: ${charDecl.militaryServiceDetails}` : ""}
군사 훈련: ${charDecl.militaryTraining}${charDecl.militaryTraining === "Yes" ? `\n훈련 상세: ${charDecl.militaryTrainingDetails}` : ""}
인신매매: ${charDecl.peopleSmuggling}
추방/강제출국: ${charDecl.deported}
비자 초과체류: ${charDecl.overstayed}
미납 채무: ${charDecl.outstandingDebts}

■ 선언문
모든 학생 선언문 동의: Yes
모든 일반 선언문 동의: Yes

---
제출 일시: ${new Date().toLocaleString("ko-KR")}
Reference: REF-${Date.now().toString(36).toUpperCase()}
      `.trim();

      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name:    `${personal.familyName}, ${personal.givenNames}`,
          email:   contact.email || "미입력",
          time:    new Date().toLocaleString("ko-KR"),
          message: body,
        },
        EMAILJS_PUBLIC_KEY
      );
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setError("이메일 전송 실패: " + (e?.text || e?.message || "잠시 후 다시 시도해 주세요."));
    }
    setLoading(false);
  };

  if (submitted) return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", maxWidth: 440 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 36 }}>✓</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>신청서 제출 완료!</h2>
          <p style={{ color: "#64748b", lineHeight: 1.7 }}><strong>{personal.familyName}, {personal.givenNames}</strong> 님의 학생비자 신청서가 접수되었습니다.</p>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>담당자가 1~2 영업일 내에 연락드릴 예정입니다.</p>
        </div>
      </div>
    </>
  );

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{css}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 16px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.navy, borderRadius: 100, padding: "6px 18px", marginBottom: 14 }}>
            <span style={{ color: "#93c5fd", fontSize: 13 }}>✈</span>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: ".08em" }}>SUBCLASS 500 — STUDENT VISA</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>학생비자 신청서</h1>
          <p style={{ color: COLORS.muted, fontSize: 13 }}>Department of Home Affairs — 모든 항목을 정확히 입력해 주세요</p>
        </div>

        {/* Step indicators */}
        <div className="card" style={{ padding: "14px 16px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", overflowX: "auto", gap: 4, marginBottom: 10 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.id < step ? COLORS.navy : s.id === step ? COLORS.blue : "#e2e8f0", color: s.id <= step ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, transition: "all .3s" }}>
                    {s.id < step ? "✓" : s.id}
                  </div>
                  <span style={{ fontSize: 10, color: s.id === step ? COLORS.navy : "#94a3b8", fontWeight: s.id === step ? 700 : 400, marginTop: 3, whiteSpace: "nowrap" }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: 20, height: 2, background: s.id < step ? COLORS.navy : "#e2e8f0", margin: "0 2px 14px", transition: "background .3s" }} />}
              </div>
            ))}
          </div>
          <div style={{ height: 4, background: "#e2e8f0", borderRadius: 4 }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg,${COLORS.navy},${COLORS.blue})`, width: `${progress}%`, borderRadius: 4, transition: "width .4s ease" }} />
          </div>
        </div>

        {/* ─── STEP 1: Application Context ─── */}
        {step === 1 && (
          <div className="card">
            <SecTitle icon="📋" title="신청 개요 (Application Context)" />
            <S label="현재 위치 (Current Location)" value={ctx.currentLocation} onChange={setCtxF("currentLocation")} options={[{ v: "AUSTRALIA", l: "호주 (Australia)" }, { v: "OUTSIDE_AUSTRALIA", l: "호주 외 (Outside Australia)" }]} required />
            {ctx.currentLocation === "OUTSIDE_AUSTRALIA" && (
              <I label="현재 위치 국가 (Country — 호주 외)" value={ctx.outsideAustraliaCountry} onChange={setCtxF("outsideAustraliaCountry")} placeholder="예: South Korea, Japan, USA..." required />
            )}
            <YN label="학생비자 최초 신청입니까? (First time applying for student visa?)" value={ctx.firstTime} onChange={setCtxF("firstTime")} required />
          </div>
        )}

        {/* ─── STEP 2: Personal Info ─── */}
        {step === 2 && (
          <div className="card">
            <SecTitle icon="👤" title="주 신청인 개인정보 (Primary Applicant)" />
            <p className="hint" style={{ marginBottom: 14 }}>⚠️ 여권에 기재된 영문 이름을 정확히 입력하세요.</p>
            <div className="row row-2">
              <I label="성 (Family Name)" value={personal.familyName} onChange={setPersonalF("familyName")} placeholder="KIM" required />
              <I label="이름 (Given Names)" value={personal.givenNames} onChange={setPersonalF("givenNames")} placeholder="HYUNGJIN" required />
            </div>
            <div className="row row-2">
              <S label="성별 (Sex)" value={personal.sex} onChange={setPersonalF("sex")} options={[{ v: "Male", l: "남성 (Male)" }, { v: "Female", l: "여성 (Female)" }, { v: "Other", l: "기타 (Other)" }]} required />
              <I label="생년월일 (Date of Birth)" value={personal.dob} onChange={setPersonalF("dob")} type="date" required />
            </div>
            <S label="관계 상태 (Relationship Status)" value={personal.relStatus} onChange={setPersonalF("relStatus")} options={["Single", "Married", "De Facto", "Separated", "Divorced", "Widowed"]} required />
            <YN label="현재 또는 과거에 다른 이름을 사용한 적이 있습니까? (Other names/spellings?)" value={personal.hasOtherNames} onChange={setPersonalF("hasOtherNames")} />
            <YN label="여권 발급국의 시민권자입니까? (Citizen of passport country?)" value={personal.citizenOfPassport} onChange={setPersonalF("citizenOfPassport")} required />
            <YN label="다른 국가의 시민권도 보유하고 있습니까? (Citizen of any other country?)" value={personal.citizenOther} onChange={setPersonalF("citizenOther")} />
            <YN label="다른 현재 여권이 있습니까? (Other current passports?)" value={personal.hasOtherPassports} onChange={setPersonalF("hasOtherPassports")} />
            <YN label="다른 신원 확인 서류가 있습니까? (Other identity documents?)" value={personal.hasOtherIdDocs} onChange={setPersonalF("hasOtherIdDocs")} />
          </div>
        )}

        {/* ─── STEP 3: Passport & National ID & Birth ─── */}
        {step === 3 && (
          <div className="card">
            <SecTitle icon="🛂" title="여권 정보 (Passport Details)" />
            <p className="hint" style={{ marginBottom: 14 }}>⚠️ 여권에 기재된 정보와 정확히 일치해야 합니다.</p>
            <PassportFields data={{ familyName: personal.familyName, givenNames: personal.givenNames, sex: personal.sex, dob: personal.dob, passportNo: passport.passportNo, passportCountry: passport.passportCountry, nationality: passport.nationality, issueDate: passport.issueDate, expiry: passport.expiry, issuer: passport.issuer }} set={setPassportF} />

            <div style={{ marginTop: 8 }}>
              <SecTitle icon="🪪" title="국가 신분증 (National Identity Card)" />
              <YN label="국가 신분증이 있습니까? (Have a national identity card?)" value={passport.hasNationalId} onChange={setPassportF("hasNationalId")} required />
              {passport.hasNationalId === "Yes" && <NationalIdFields data={passport} set={setPassportF} />}
            </div>

            <div style={{ marginTop: 8 }}>
              <SecTitle icon="📍" title="출생지 (Place of Birth)" />
              <BirthFields data={passport} set={setPassportF} />
            </div>
          </div>
        )}

        {/* ─── STEP 4: Health & Accompanying Family ─── */}
        {step === 4 && (
          <div className="card">
            <SecTitle icon="🏥" title="건강검진 (Health Examination)" />
            <YN label="최근 12개월 내 호주 비자를 위한 건강검진을 받았습니까? (Health exam in last 12 months?)" value={health.hadHealthExam} onChange={setHealthF("hadHealthExam")} required />
            {health.hadHealthExam === "Yes" && <I label="HAP ID (건강검진 ID)" value={health.hapId} onChange={setHealthF("hapId")} placeholder="35224429" />}

            <div style={{ marginTop: 8 }}>
              <SecTitle icon="👨‍👩‍👧" title="동반 가족 (Accompanying Family Members)" />
              <YN label="이 신청서에 포함된 동반 가족이 있습니까? (Any accompanying family members?)" value={health.hasAccompanying} onChange={setHealthF("hasAccompanying")} required />
              {health.hasAccompanying === "Yes" && accompanying.map((m, i) => (
                <div key={i} className="sub-card">
                  <div className="sub-card-header">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>동반가족 #{i + 1}</span>
                    {accompanying.length > 1 && <button className="btn-danger" onClick={() => removeArr(accompanying, setAccompanying, i)}>삭제</button>}
                  </div>
                  <S label="주 신청인과의 관계 (Relationship)" value={m.relationship} onChange={v => updateArr(accompanying, setAccompanying, i, "relationship", v)} options={["Spouse/De Facto Partner", "Child", "Other"]} required />
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#374151", margin: "10px 0 8px" }}>여권 정보</p>
                  <div className="row row-2">
                    <I label="성 (Family Name)" value={m.familyName} onChange={v => updateArr(accompanying, setAccompanying, i, "familyName", v)} placeholder="JUNG" required />
                    <I label="이름 (Given Names)" value={m.givenNames} onChange={v => updateArr(accompanying, setAccompanying, i, "givenNames", v)} placeholder="Hkkk" required />
                  </div>
                  <div className="row row-3">
                    <S label="성별" value={m.sex} onChange={v => updateArr(accompanying, setAccompanying, i, "sex", v)} options={[{ v: "Male", l: "남성" }, { v: "Female", l: "여성" }]} />
                    <I label="생년월일" value={m.dob} onChange={v => updateArr(accompanying, setAccompanying, i, "dob", v)} type="date" />
                    <I label="여권번호" value={m.passportNo} onChange={v => updateArr(accompanying, setAccompanying, i, "passportNo", v)} placeholder="M04116" />
                  </div>
                  <div className="row row-2">
                    <S label="여권 발급국" value={m.passportCountry} onChange={v => updateArr(accompanying, setAccompanying, i, "passportCountry", v)} options={["KOREA, REPUBLIC OF (SOUTH)", "AUSTRALIA", "OTHER"]} />
                    <S label="국적" value={m.nationality} onChange={v => updateArr(accompanying, setAccompanying, i, "nationality", v)} options={["KOREA, REPUBLIC OF (SOUTH)", "AUSTRALIAN", "OTHER"]} />
                  </div>
                  <div className="row row-3">
                    <I label="여권 발급일" value={m.issueDate} onChange={v => updateArr(accompanying, setAccompanying, i, "issueDate", v)} type="date" />
                    <I label="여권 만료일" value={m.expiry} onChange={v => updateArr(accompanying, setAccompanying, i, "expiry", v)} type="date" />
                    <I label="발급기관" value={m.issuer} onChange={v => updateArr(accompanying, setAccompanying, i, "issuer", v)} placeholder="MINISTRY OF FOREIGN AFFAIRS" />
                  </div>
                  <div className="row row-3">
                    <I label="출생 도시" value={m.birthTown} onChange={v => updateArr(accompanying, setAccompanying, i, "birthTown", v)} placeholder="Seoul" />
                    <I label="출생 주/도" value={m.birthState} onChange={v => updateArr(accompanying, setAccompanying, i, "birthState", v)} placeholder="Seoul" />
                    <S label="출생 국가" value={m.birthCountry} onChange={v => updateArr(accompanying, setAccompanying, i, "birthCountry", v)} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} />
                  </div>
                  <S label="관계 상태" value={m.relStatus} onChange={v => updateArr(accompanying, setAccompanying, i, "relStatus", v)} options={["Single", "Married", "De Facto", "Separated", "Divorced", "Widowed"]} />
                  <div className="row row-2">
                    <YN label="호주 비자 번호 보유?" value={m.hasAusVisa} onChange={v => updateArr(accompanying, setAccompanying, i, "hasAusVisa", v)} />
                    {m.hasAusVisa === "Yes" && <I label="호주 비자 번호 (Visa Grant Number)" value={m.ausVisaNumber} onChange={v => updateArr(accompanying, setAccompanying, i, "ausVisaNumber", v)} placeholder="0049516136166" />}
                  </div>
                  <YN label="최근 12개월 내 건강검진 완료?" value={m.hadHealthExam} onChange={v => updateArr(accompanying, setAccompanying, i, "hadHealthExam", v)} />
                  <YN label="18세 미만 자녀?" value={m.isChild} onChange={v => updateArr(accompanying, setAccompanying, i, "isChild", v)} />
                </div>
              ))}
              {health.hasAccompanying === "Yes" && <AddBtn onClick={() => addArr(accompanying, setAccompanying, blankFamily)} label="동반가족 추가" />}
            </div>
          </div>
        )}

        {/* ─── STEP 5: Contact Details ─── */}
        {step === 5 && (
          <div className="card">
            <SecTitle icon="📞" title="연락처 (Contact Details)" />
            <div className="row row-2">
              <S label="현재 거주국 (Country of Residence)" value={contact.countryOfResidence} onChange={setContactF("countryOfResidence")} options={["KOREA, SOUTH", "AUSTRALIA", "CHINA", "JAPAN", "OTHER"]} required />
              <S label="관할 호주 사무소 (Department Office)" value={contact.office} onChange={setContactF("office")} options={["Australia, Adelaide Regional Office", "Australia, Brisbane", "Australia, Melbourne", "Australia, Perth", "Australia, Sydney", "Seoul, South Korea"]} />
            </div>

            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "12px 0 8px" }}>거주지 주소 (Residential Address) — 거리 주소 필수</p>
            <S label="국가 (Country)" value={contact.resCountry} onChange={setContactF("resCountry")} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} required />
            <I label="주소 (Street Address)" value={contact.resAddress} onChange={setContactF("resAddress")} placeholder="104-1057, 33, Achi-ro, Buk-gu" required />
            <div className="row row-3">
              <I label="도시 (Suburb/Town)" value={contact.resCity} onChange={setContactF("resCity")} placeholder="Pohang-si" required />
              <I label="주/도 (State/Province)" value={contact.resState} onChange={setContactF("resState")} placeholder="GYEONGSANGBUK-DO" />
              <I label="우편번호 (Postal Code)" value={contact.resPostcode} onChange={setContactF("resPostcode")} placeholder="37113" />
            </div>

            <YN label="우편 주소가 거주지 주소와 동일합니까?" value={contact.samePostal} onChange={setContactF("samePostal")} required />
            {contact.samePostal === "No" && (
              <>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "10px 0 8px" }}>우편 주소 (Postal Address)</p>
                <S label="국가" value={contact.postCountry} onChange={setContactF("postCountry")} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} />
                <I label="주소" value={contact.postAddress} onChange={setContactF("postAddress")} placeholder="U2/5 Brigahggg Ave" />
                <div className="row row-3">
                  <I label="도시" value={contact.postCity} onChange={setContactF("postCity")} placeholder="Kenston Gardens" />
                  <I label="주/도" value={contact.postState} onChange={setContactF("postState")} placeholder="South Australia" />
                  <I label="우편번호" value={contact.postPostcode} onChange={setContactF("postPostcode")} placeholder="5068" />
                </div>
              </>
            )}

            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "12px 0 8px" }}>전화번호 (숫자만 입력, 공백 없이)</p>
            <div className="row row-3">
              <I label="집 전화 (Home Phone)" value={contact.homePhone} onChange={setContactF("homePhone")} placeholder="" />
              <I label="직장 전화 (Business Phone)" value={contact.businessPhone} onChange={setContactF("businessPhone")} placeholder="" />
              <I label="휴대전화 (Mobile)" value={contact.mobilePhone} onChange={setContactF("mobilePhone")} placeholder="0411111717" required />
            </div>
            <I label="이메일 (Email Address)" value={contact.email} onChange={setContactF("email")} type="email" placeholder="hjk95588=@gmail.com" required />
          </div>
        )}

        {/* ─── STEP 6: Non-Accompanying & Other Family ─── */}
        {step === 6 && (
          <div className="card">
            <SecTitle icon="👪" title="비동반 가족 (Non-Accompanying Family Unit)" />
            <p className="hint" style={{ marginBottom: 12 }}>비동반 가족을 포함하지 않으면 나중에 학생비자를 받을 수 없을 수 있습니다.</p>
            <YN label="이 신청서에 포함되지 않은 가족 구성원이 있습니까? (Any non-accompanying family members?)" value={fam.hasNonAccompanying} onChange={setFamF("hasNonAccompanying")} required />

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="🧑‍🤝‍🧑" title="기타 가족 (Other Family Members — Parents/Siblings)" />
              <YN label="호주 내외의 부모 또는 형제자매가 있습니까? (Parents or siblings?)" value={fam.hasOtherFamily} onChange={setFamF("hasOtherFamily")} required />
              {fam.hasOtherFamily === "Yes" && (
                <>
                  {otherFamily.map((m, i) => (
                    <div key={i} className="sub-card">
                      <div className="sub-card-header">
                        <span style={{ fontSize: 13, fontWeight: 600 }}>가족 #{i + 1}</span>
                        {otherFamily.length > 1 && <button className="btn-danger" onClick={() => removeArr(otherFamily, setOtherFamily, i)}>삭제</button>}
                      </div>
                      <S label="관계 (Relationship)" value={m.relationship} onChange={v => updateArr(otherFamily, setOtherFamily, i, "relationship", v)} options={["Parent", "Brother", "Sister", "Step-Parent", "Half-Brother", "Half-Sister"]} required />
                      <div className="row row-2">
                        <I label="성 (Family Name)" value={m.familyName} onChange={v => updateArr(otherFamily, setOtherFamily, i, "familyName", v)} placeholder="KIM" required />
                        <I label="이름 (Given Names)" value={m.givenNames} onChange={v => updateArr(otherFamily, setOtherFamily, i, "givenNames", v)} placeholder="Yjjj" required />
                      </div>
                      <div className="row row-3">
                        <S label="성별" value={m.sex} onChange={v => updateArr(otherFamily, setOtherFamily, i, "sex", v)} options={[{ v: "Male", l: "남성" }, { v: "Female", l: "여성" }]} />
                        <I label="생년월일" value={m.dob} onChange={v => updateArr(otherFamily, setOtherFamily, i, "dob", v)} type="date" />
                        <S label="거주국" value={m.countryOfResidence} onChange={v => updateArr(otherFamily, setOtherFamily, i, "countryOfResidence", v)} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} />
                      </div>
                    </div>
                  ))}
                  <AddBtn onClick={() => addArr(otherFamily, setOtherFamily, blankOtherFamily)} label="가족 추가" />
                </>
              )}
            </div>
          </div>
        )}

        {/* ─── STEP 7: Funding ─── */}
        {step === 7 && (
          <div className="card">
            <SecTitle icon="💰" title="재정 지원 (Funding for Stay)" />
            <YN label="모든 신청인이 체류 기간 동안 충분한 자금이 있음을 확인합니까?" value={funding.confirmedFunds} onChange={setFundingF("confirmedFunds")} required />
            <YN label="신청인 외 개인이 자금을 지원합니까? (Financial support from an individual?)" value={funding.fundingFromIndividual} onChange={setFundingF("fundingFromIndividual")} />
            {funding.fundingFromIndividual === "Yes" && (
              <div className="sub-card">
                <S label="지원자 관계 (Relationship to Applicant)" value={funding.fundingRelationship} onChange={setFundingF("fundingRelationship")} options={["Parent", "Spouse/De Facto", "Employer", "Government", "Other"]} />
                <S label="자금 유형 (Funding Type)" value={funding.fundingType} onChange={setFundingF("fundingType")} options={["Deposit in financial institution", "Scholarship", "Loan agreement", "Property", "Other"]} />
                <div className="row row-2">
                  <I label="금액 (AUD — 달러만)" value={funding.fundingAmount} onChange={setFundingF("fundingAmount")} type="number" placeholder="571111" />
                  <I label="금융기관 (Financial Institution)" value={funding.fundingInstitution} onChange={setFundingF("fundingInstitution")} placeholder="Commercial Bank" />
                </div>
                <YN label="신청인 본인 명의 계좌입니까?" value={funding.fundingOwnName} onChange={setFundingF("fundingOwnName")} />
                <T label="자금 접근 방법 (How will the applicant access the funds?)" value={funding.fundingAccessDetails} onChange={setFundingF("fundingAccessDetails")} placeholder="My parents will transfer funds monthly..." rows={2} />
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 8: Education & Employment ─── */}
        {step === 8 && (
          <div className="card">
            <SecTitle icon="📚" title="학력 (Education)" />
            <S label="호주 외에서 완료한 최고 학력 수준 (Highest level of schooling outside Australia)" value={edu.highestSchooling} onChange={setEduF("highestSchooling")} options={["Secondary school - Year 11 or lower or equivalent", "Secondary school - Year 12 or equivalent", "Certificate I/II", "Certificate III/IV", "Diploma/Advanced Diploma", "Bachelor Degree", "Graduate Certificate/Diploma", "Masters Degree", "Doctorate"]} required />
            <div className="row row-2">
              <I label="코스명 (Course Name)" value={edu.schoolingCourse} onChange={setEduF("schoolingCourse")} placeholder="High School" />
              <I label="학교명 (Institution Name)" value={edu.schoolingInstitution} onChange={setEduF("schoolingInstitution")} placeholder="Dang High School" />
            </div>
            <S label="학교 국가 (Country)" value={edu.schoolingCountry} onChange={setEduF("schoolingCountry")} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} />

            <YN label="호주 외 다른 학업 이력이 있습니까? (Other studies or training outside Australia?)" value={edu.hasOtherStudies} onChange={setEduF("hasOtherStudies")} />
            {edu.hasOtherStudies === "Yes" && (
              <>
                {eduHistory.map((e, i) => (
                  <div key={i} className="sub-card">
                    <div className="sub-card-header">
                      <span style={{ fontSize: 13, fontWeight: 600 }}>학력 #{i + 1}</span>
                      {eduHistory.length > 1 && <button className="btn-danger" onClick={() => removeArr(eduHistory, setEduHistory, i)}>삭제</button>}
                    </div>
                    <div className="row row-2">
                      <S label="자격 (Qualification)" value={e.qualification} onChange={v => updateArr(eduHistory, setEduHistory, i, "qualification", v)} options={["AQF Certificate I", "AQF Certificate II", "AQF Certificate III", "AQF Certificate IV", "Diploma", "Advanced Diploma", "Bachelor Degree", "Graduate Certificate", "Graduate Diploma", "Masters Degree", "Doctorate", "Other"]} />
                      <I label="학습 분야 (Field of Study)" value={e.field} onChange={v => updateArr(eduHistory, setEduHistory, i, "field", v)} placeholder="Automotive Engineering" />
                    </div>
                    <I label="코스명 (Course Name)" value={e.courseName} onChange={v => updateArr(eduHistory, setEduHistory, i, "courseName", v)} placeholder="Certificate III in Light Vehicle Mechanical Technology" required />
                    <div className="row row-2">
                      <I label="기관명 (Institution)" value={e.institution} onChange={v => updateArr(eduHistory, setEduHistory, i, "institution", v)} placeholder="Alliance College" />
                      <S label="국가" value={e.country} onChange={v => updateArr(eduHistory, setEduHistory, i, "country", v)} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} />
                    </div>
                    <div className="row row-2">
                      <I label="시작일 (Date From)" value={e.dateFrom} onChange={v => updateArr(eduHistory, setEduHistory, i, "dateFrom", v)} type="date" />
                      <I label="종료일 (Date To)" value={e.dateTo} onChange={v => updateArr(eduHistory, setEduHistory, i, "dateTo", v)} type="date" />
                    </div>
                  </div>
                ))}
                <AddBtn onClick={() => addArr(eduHistory, setEduHistory, blankEdu)} label="학력 추가" />
              </>
            )}
            <YN label="호주에서 학업한 이력이 있습니까? (Previously studied in Australia?)" value={edu.studiedInAustralia} onChange={setEduF("studiedInAustralia")} />
            {edu.studiedInAustralia === "Yes" && (
              <div className="sub-card">
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>호주 학업 이력 상세</p>
                <I label="학교명 (Institution Name)" value={edu.ausStudySchool} onChange={setEduF("ausStudySchool")} placeholder="예: Alliance College, University of Adelaide..." required />
                <I label="과목명 / 코스명 (Course/Subject Name)" value={edu.ausStudySubject} onChange={setEduF("ausStudySubject")} placeholder="예: Certificate III in Light Vehicle Mechanical Technology" required />
                <I label="기간 (Period — 예: 2024.01 ~ 2025.06)" value={edu.ausStudyPeriod} onChange={setEduF("ausStudyPeriod")} placeholder="예: 2024.01 ~ 2025.06" required />
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="💼" title="취업 이력 (Employment History)" />
              <p className="hint" style={{ marginBottom: 12 }}>고등학교/대학 졸업 이후의 모든 취업, 실업 기간을 포함하세요. (유급, 무급, 자원봉사 포함)</p>
              {empHistory.map((e, i) => (
                <div key={i} className="sub-card">
                  <div className="sub-card-header">
                    <span style={{ fontSize: 13, fontWeight: 600 }}>취업 이력 #{i + 1}</span>
                    {empHistory.length > 1 && <button className="btn-danger" onClick={() => removeArr(empHistory, setEmpHistory, i)}>삭제</button>}
                  </div>
                  <div className="row row-2">
                    <S label="고용 상태 (Employment Status)" value={e.status} onChange={v => updateArr(empHistory, setEmpHistory, i, "status", v)} options={["Employed", "Unemployed", "Self-employed", "Student", "Home duties"]} required />
                    <YN label="현재 고용 상태입니까?" value={e.isCurrent} onChange={v => updateArr(empHistory, setEmpHistory, i, "isCurrent", v)} />
                  </div>
                  {e.status === "Employed" || e.status === "Self-employed" ? (
                    <>
                      <I label="기관/회사명 (Organisation Name)" value={e.orgName} onChange={v => updateArr(empHistory, setEmpHistory, i, "orgName", v)} placeholder="CSW Total Services Pty Ltd" required />
                      <S label="업종 (Industry Type)" value={e.industry} onChange={v => updateArr(empHistory, setEmpHistory, i, "industry", v)} options={["Agriculture, Forestry and Fishing", "Mining", "Manufacturing", "Electricity, Gas, Water", "Construction", "Wholesale Trade", "Retail Trade", "Accommodation and Food Services", "Transport, Postal and Warehousing", "Information Technology", "Financial Services", "Education and Training", "Health Care", "Other"]} />
                      <S label="국가" value={e.country} onChange={v => updateArr(empHistory, setEmpHistory, i, "country", v)} options={["KOREA, SOUTH", "AUSTRALIA", "OTHER"]} />
                      <I label="주소" value={e.address} onChange={v => updateArr(empHistory, setEmpHistory, i, "address", v)} placeholder="111 Eldridge Rd" />
                      <div className="row row-3">
                        <I label="도시" value={e.city} onChange={v => updateArr(empHistory, setEmpHistory, i, "city", v)} placeholder="Condel Park" />
                        <I label="주/도" value={e.state} onChange={v => updateArr(empHistory, setEmpHistory, i, "state", v)} placeholder="New South Wales" />
                        <I label="우편번호" value={e.postcode} onChange={v => updateArr(empHistory, setEmpHistory, i, "postcode", v)} placeholder="2200" />
                      </div>
                      <div className="row row-2">
                        <I label="담당자 성 (Contact Family Name)" value={e.contactFamily} onChange={v => updateArr(empHistory, setEmpHistory, i, "contactFamily", v)} placeholder="Park" />
                        <I label="담당자 이름 (Contact Given Names)" value={e.contactGiven} onChange={v => updateArr(empHistory, setEmpHistory, i, "contactGiven", v)} placeholder="Joshua" />
                      </div>
                      <I label="담당자 전화 (Business Phone)" value={e.contactPhone} onChange={v => updateArr(empHistory, setEmpHistory, i, "contactPhone", v)} placeholder="0298921119" />
                      <I label="직책 (Position)" value={e.position} onChange={v => updateArr(empHistory, setEmpHistory, i, "position", v)} placeholder="General worker" required />
                    </>
                  ) : null}
                  <div className="row row-2">
                    <I label="시작일 (Date From)" value={e.dateFrom} onChange={v => updateArr(empHistory, setEmpHistory, i, "dateFrom", v)} type="date" required />
                    <I label="종료일 (Date To)" value={e.dateTo} onChange={v => updateArr(empHistory, setEmpHistory, i, "dateTo", v)} type="date" />
                  </div>
                </div>
              ))}
              <AddBtn onClick={() => addArr(empHistory, setEmpHistory, blankEmp)} label="취업/실업 이력 추가" />

              <div style={{ marginTop: 16 }}>
                <YN label="코스 완료 후 취업 제안을 받았습니까? (Been offered a job at completion?)" value={futureEmp.hasJobOffer} onChange={setFutureEmpF("hasJobOffer")} />
                <T label="코스 완료 후 어떤 취업을 원합니까? (Future employment details)" value={futureEmp.details} onChange={setFutureEmpF("details")} placeholder="Completing this automotive course will enhance my employment in Korea's automotive sector..." rows={3} />
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 9: Language & Travel & Visa History ─── */}
        {step === 9 && (
          <div className="card">
            <SecTitle icon="🗣️" title="언어 능력 — 주 신청인 (Language)" />
            <YN label="ELICOS 과정을 이수 중이거나 완료했습니까?" value={lang.hasElicos} onChange={setLangF("hasElicos")} />
            <YN label="최근 24개월 내 영어 시험을 응시했습니까? (English language test in last 24 months?)" value={lang.hasEnglishTest} onChange={setLangF("hasEnglishTest")} />
            <I label="주 사용 언어 (Main Language)" value={lang.mainLanguage} onChange={setLangF("mainLanguage")} placeholder="Korean" required />
            <YN label="영어로 진행된 5년 이상 학업(호주/캐나다/영국 등)을 완료했습니까?" value={lang.hasEnglishStudy} onChange={setLangF("hasEnglishStudy")} />
            <YN label="최근 2년 내 호주 고등학교 졸업장(Senior Secondary Certificate)을 취득했습니까?" value={lang.hasSeniorSecondary} onChange={setLangF("hasSeniorSecondary")} />
            <YN label="최근 2년 내 학생비자로 호주에서 AQF Certificate IV 이상을 실질적으로 완료했습니까?" value={lang.hasAQF} onChange={setLangF("hasAQF")} />

            {health.hasAccompanying === "Yes" && (
              <I label="동반 가족의 주 사용 언어 (Family Member Main Language)" value={lang.famMainLanguage} onChange={setLangF("famMainLanguage")} placeholder="Korean" />
            )}

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="✈️" title="방문 국가 (Countries Visited — 최근 10년)" />
              <p className="hint" style={{ marginBottom: 10 }}>호주 거주 외 업무/학업, 여행, 휴가, 군 복무, 일반 거주국 방문 포함</p>
              <YN label="최근 10년 내 다른 국가를 방문한 적이 있습니까?" value={hasVisited} onChange={setHasVisited} required />
              {hasVisited === "Yes" && (
                <>
                  {travels.map((t, i) => (
                    <div key={i} className="sub-card">
                      <div className="sub-card-header">
                        <span style={{ fontSize: 13, fontWeight: 600 }}>방문 #{i + 1}</span>
                        {travels.length > 1 && <button className="btn-danger" onClick={() => removeArr(travels, setTravels, i)}>삭제</button>}
                      </div>
                      <div className="row row-2">
                        <I label="해당 신청인 이름 (Name)" value={t.personName} onChange={v => updateArr(travels, setTravels, i, "personName", v)} placeholder={`${personal.familyName}, ${personal.givenNames}`} />
                        <I label="방문 국가 (Country)" value={t.country} onChange={v => updateArr(travels, setTravels, i, "country", v)} placeholder="JAPAN" required />
                      </div>
                      <div className="row row-3">
                        <I label="방문 시작일" value={t.dateFrom} onChange={v => updateArr(travels, setTravels, i, "dateFrom", v)} type="date" required />
                        <I label="방문 종료일" value={t.dateTo} onChange={v => updateArr(travels, setTravels, i, "dateTo", v)} type="date" required />
                        <S label="방문 이유 (Reason)" value={t.reason} onChange={v => updateArr(travels, setTravels, i, "reason", v)} options={["Travel", "Working Holiday", "Work", "Study", "Business", "Family visit", "Military deployment", "Other"]} required />
                      </div>
                    </div>
                  ))}
                  <AddBtn onClick={() => addArr(travels, setTravels, blankTravel)} label="방문 국가 추가" />
                </>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="📑" title="비자 이력 (Visa History)" />
              <T label="호주 또는 다른 국가의 비자 보유/보유했던 이력" value={visaHist.details} onChange={setVisaF("details")} placeholder="예: Australia - Working holiday 1st, 2nd visa / Japan - Visitor Pass ..." rows={4} hint="모든 비자 이력을 국가별로 나열해 주세요" />
              <YN label="호주 또는 다른 국가에서 비자 조건을 준수하지 않았거나 허가 기간을 초과한 적이 있습니까?" value={visaHist.hasNotComplied} onChange={setVisaF("hasNotComplied")} required />
              <YN label="호주 또는 다른 국가에서 입국 신청이 거부되거나 비자가 취소된 적이 있습니까?" value={visaHist.hasBeenRefused} onChange={setVisaF("hasBeenRefused")} required />
            </div>
          </div>
        )}

        {/* ─── STEP 10: Declarations ─── */}
        {step === 10 && (
          <div className="card">
            <SecTitle icon="🏥" title="건강 신고 (Health Declarations)" />
            {[
              ["livedOutside", "최근 5년 내 본국 외에서 3개월 이상 연속 거주한 적이 있습니까?"],
              ["intendHospital", "호주에서 병원/요양원 등 의료기관에 입원할 예정입니까?"],
              ["intendHealthWorker", "호주에서 의료 종사자로 근무/학습/훈련할 예정입니까?"],
              ["intendAgedCare", "호주에서 노인/장애인 케어 분야에서 근무/학습/훈련할 예정입니까?"],
              ["intendChildCare", "호주에서 보육원(유치원 포함)에서 근무 또는 훈련생이 될 예정입니까?"],
              ["tuberculosis", "결핵을 앓은 적이 있거나, 결핵 가족 접촉력이 있거나, 흉부 X-ray에서 이상 소견이 있었습니까?"],
              ["medicalCosts", "체류 기간 동안 혈액 질환, 암, 심장 질환, B/C형 간염, HIV, 신장 질환, 정신 질환, 임신, 호흡기 질환 등으로 치료/의료비가 예상됩니까?"],
              ["requiresOngoingCare", "지속적인 의료 관리나 특수 장비/보조 기술이 필요합니까?"],
            ].map(([field, label]) => (
              <YN key={field} label={label} value={healthDecl[field]} onChange={setHealthDeclF(field)} required />
            ))}

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="⚖️" title="인성 선언 (Character Declarations)" />
              <p className="hint" style={{ marginBottom: 12 }}>⚠️ 'Yes'에 해당하는 경우 모든 관련 상세 정보를 제공해야 합니다.</p>
              {[
                ["pending", "현재 법적 조치를 기다리고 있는 혐의가 있습니까?"],
                ["convicted", "어느 국가에서든 유죄 판결을 받은 적이 있습니까?"],
                ["domesticViolence", "가정폭력 또는 가족폭력 명령을 받은 적이 있습니까?"],
                ["arrestWarrant", "체포 영장 또는 Interpol 수배를 받은 적이 있습니까?"],
                ["sexualOffenceChild", "아동을 대상으로 한 성범죄 혐의로 유죄 판결을 받은 적이 있습니까?"],
                ["sexRegister", "성범죄자 등록부에 등재된 적이 있습니까?"],
                ["acquitted", "정신이상을 이유로 무죄 판결을 받은 적이 있습니까?"],
                ["unfitToPlea", "법정에서 변론 능력이 없다고 판단된 적이 있습니까?"],
                ["nationalSecurity", "호주 또는 다른 국가의 국가 안보를 위협하는 활동에 직간접적으로 참여하거나 관련된 적이 있습니까?"],
                ["warCrimes", "집단학살, 전쟁범죄, 인도에 반한 죄, 고문, 노예제도 등으로 기소된 적이 있습니까?"],
                ["associatedCriminals", "범죄 행위에 관련된 개인/그룹/조직과 관련이 있습니까?"],
                ["associatedViolence", "폭력 행위(전쟁, 반란, 테러 등)에 관여한 조직과 관련이 있습니까?"],
                ["peopleSmuggling", "인신매매 또는 밀입국 알선 행위에 관련된 적이 있습니까?"],
                ["deported", "어느 국가에서든 추방 또는 강제출국 처분을 받은 적이 있습니까?"],
                ["overstayed", "어느 국가에서든 비자를 초과 체류한 적이 있습니까?"],
                ["outstandingDebts", "호주 정부 또는 호주 공공기관에 미납 채무가 있습니까?"],
              ].map(([field, label]) => (
                <YN key={field} label={label} value={charDecl[field]} onChange={setCharDeclF(field)} required />
              ))}
            </div>

            {charDecl.militaryService === undefined && null}
            <div style={{ marginTop: 4 }}>
              <YN label="군대, 경찰, 준군사조직 또는 정보기관에서 복무한 적이 있습니까?" value={charDecl.militaryService} onChange={setCharDeclF("militaryService")} required />
              {charDecl.militaryService === "Yes" && (
                <T label="복무 상세 정보 (국가, 기간, 담당 임무 포함)" value={charDecl.militaryServiceDetails} onChange={setCharDeclF("militaryServiceDetails")} placeholder="예: KOREA, SOUTH / 2019.02.26 ~ 2020.09.29 / Discharge from South Korea Compulsory Military Service" rows={3} />
              )}
              <YN label="군사/준군사 훈련을 받거나 무기/폭발물 훈련을 받은 적이 있습니까?" value={charDecl.militaryTraining} onChange={setCharDeclF("militaryTraining")} required />
              {charDecl.militaryTraining === "Yes" && (
                <T label="훈련 상세 정보" value={charDecl.militaryTrainingDetails} onChange={setCharDeclF("militaryTrainingDetails")} placeholder="예: South Korea Compulsory Military Service - Standard training" rows={2} />
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="📝" title="학생 선언문 (Student Declarations)" />
              <p className="hint" style={{ marginBottom: 10 }}>아래 항목 모두에 체크하세요.</p>
              {[
                ["readStudyAustralia", "studyaustralia.gov.au에서 제공된 호주 생활 및 학업 정보를 읽고 이해했습니다."],
                ["healthInsurance", "체류 기간 동안 건강보험을 유지하기 위한 적절한 준비를 했습니다."],
                ["genuineStudent", "학습을 성공적으로 이수하기 위한 진정한 학생으로서 호주에 입국하고자 합니다."],
                ["understandTemp", "학생 비자는 임시 비자이며, 학생 비자 승인이 추가 비자 자격을 보장하지 않음을 이해합니다."],
                ["understandDepart", "추가 비자를 받지 못하면 호주를 출국해야 함을 이해합니다."],
                ["understandConditions", "비자에 부과된 모든 조건(취업 제한 포함)을 이해하고 준수할 것을 확인합니다."],
                ["understand8534", "비자에 8534 조건이 부과될 수 있음을 이해합니다."],
                ["understand8534Effect", "8534 조건의 효력으로 비자 만료 후 호주 체류가 불가함을 이해합니다."],
                ["understand8535", "비자에 8535 조건이 부과될 수 있음을 이해합니다."],
                ["understand8535Effect", "8535 조건의 효력을 이해합니다."],
              ].map(([field, label]) => (
                <div key={field} className="decl-item" onClick={() => setStudentDecl(p => ({ ...p, [field]: !p[field] }))}>
                  <input type="checkbox" checked={studentDecl[field]} onChange={() => {}} />
                  <label>{label}</label>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <SecTitle icon="✅" title="일반 선언문 (Declarations)" />
              <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", marginBottom: 10 }}>⚠️ 허위 정보 제공은 중대한 위반입니다.</p>
              {[
                ["readUnderstood", "이 신청서에 제공된 모든 정보를 읽고 이해했습니다."],
                ["completeCorrect", "이 양식 및 첨부 서류의 모든 세부 정보가 완전하고 정확합니다."],
                ["understandFraud", "허위 서류나 잘못된 정보가 제공된 경우 신청이 거부될 수 있으며, 향후 비자를 받지 못할 수 있음을 이해합니다."],
                ["understandCancellation", "비자 발급 후 서류나 정보가 부정확하다고 판명될 경우 비자가 취소될 수 있음을 이해합니다."],
                ["notIncluded", "이 신청서에 포함되지 않은 사람은 자동으로 호주 입국권이 부여되지 않음을 이해합니다."],
                ["notifyChanges", "신청 처리 중 이메일, 주소, 코스 등록, 가족 구성원에 변경이 있을 경우 즉시 서면으로 통보할 것입니다."],
                ["privacyNotice", "개인정보 고지문(Form 1442i)을 읽었습니다."],
                ["consentData", "개인정보(생체 정보 포함)가 개인정보 고지문에 명시된 대로 수집, 사용, 공개될 수 있음을 이해하고 동의합니다."],
                ["consentFingerprints", "필요한 경우 지문 및 안면 이미지 수집에 동의합니다."],
                ["consentBiometric", "생체 정보가 법 집행 기관과 공유될 수 있음을 이해합니다."],
                ["consentLawEnforcement", "법 집행 기관이 생체 정보를 이민부와 공유할 수 있음을 이해하고 동의합니다."],
                ["consentDataUse", "이민법 및 시민권법에 따라 생체/신원/범죄 기록 정보가 사용될 수 있음에 동의합니다."],
                ["unlawful", "비자가 만료되고 다른 비자가 없으면 불법 체류자가 됨을 이해합니다."],
                ["australianValues", "18세 이상인 경우, 호주 사회와 가치관에 관한 정부 제공 정보를 읽었으며 호주 가치 선언에 동의합니다."],
              ].map(([field, label]) => (
                <div key={field} className="decl-item" onClick={() => setGeneralDecl(p => ({ ...p, [field]: !p[field] }))}>
                  <input type="checkbox" checked={generalDecl[field]} onChange={() => {}} />
                  <label>{label}</label>
                </div>
              ))}
            </div>

            {error && <div className="error-box" style={{ marginTop: 12 }}>⚠️ {error}</div>}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {step > 1
            ? <button className="btn-secondary" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>← 이전</button>
            : <div style={{ flex: 1 }} />}
          {step < STEPS.length
            ? <button className="btn-primary" onClick={() => setStep(s => s + 1)} style={{ flex: 2 }}>다음 단계 →</button>
            : <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2, opacity: loading ? .7 : 1 }}>{loading ? "⏳ 제출 중..." : "✓ 신청서 제출 (Notion 저장)"}</button>}
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 14 }}>
          OFFICIAL: Sensitive — Personal Privacy | Department of Home Affairs | Subclass 500 Student Visa
        </p>
      </div>
    </>
  );
}
