export function reversePair(code: string) {
  return code.length === 2 ? `${code[1]}${code[0]}` : code;
}

export function getCategoryFromMeaning(en?: string) {
  const s = (en || '').toLowerCase();
  if (/(charm|commerce)/.test(s)) return 'charm';
  if (/(senior|support|mentor)/.test(s)) return 'mentorship';
  if (/(powerful|influence|speech)/.test(s)) return 'influence';
  if (/(negotiation|communicat)/.test(s)) return 'communication';
  if (/(stable|balance|balanced)/.test(s)) return 'stability';
  if (/(success|opportun)/.test(s)) return 'opportunity';
  if (/(stress|fatigue|temper|clash|mood)/.test(s)) return 'emotion';
  if (/(money|overwork|budget|finance)/.test(s)) return 'finance';
  if (/(harmony|family|relationship)/.test(s)) return 'harmony';
  if (/(magnetic|attraction|brand|content)/.test(s)) return 'attraction';
  return 'other';
}

export function fallbackByCategory(cat: string, positive: boolean | undefined, locale: 'th' | 'en') {
  const th = {
    charm: positive ? 'เด่นด้านเสน่ห์/การสื่อสาร แนะนำใช้ช่องทางโซเชียล–เครือข่าย เพิ่มโอกาสปิดการขาย' : 'ระวังสื่อสารคลาดเคลื่อน ตั้งสรุปงาน/ประเด็นคุยล่วงหน้า ช่วยลดความเข้าใจผิด',
    communication: positive ? 'เด่นด้านเสน่ห์/การสื่อสาร แนะนำใช้ช่องทางโซเชียล–เครือข่าย เพิ่มโอกาสปิดการขาย' : 'ระวังสื่อสารคลาดเคลื่อน ตั้งสรุปงาน/ประเด็นคุยล่วงหน้า ช่วยลดความเข้าใจผิด',
    mentorship: positive ? 'มีแรงหนุนจากผู้ใหญ่/ที่ปรึกษา ใช้โอกาสนี้ขอคำแนะนำ–รีวิวงาน เพื่อย่นเวลาเรียนรู้' : 'อาจพึ่งพาผู้ใหญ่เกินไป วางแผนพัฒนาทักษะตนเองควบคู่ ลดความเสี่ยงระยะยาว',
    influence: positive ? 'พลังอิทธิพล/การโน้มน้าวสูง ใช้ด้วยความนุ่มนวลและชัดเจน จะสร้างความไว้วางใจ' : 'ระวังใช้ถ้อยคำกดดัน ปรับโทนเป็นเชิงชวน–ยกเหตุผล ให้เกิดความร่วมมือ',
    stability: positive ? 'หนุนความมั่นคง–สมดุล วางแผนระยะยาว–งบประมาณชัด ทำให้ก้าวคงเส้นคงวา' : 'ระวังแผนสวิง จัด Weekly review/ปรับแผนเพื่อกลับสู่สมดุล',
    opportunity: positive ? 'โอกาส–การเติบโต เหมาะต่อยอดโปรเจ็กต์/ขยายตลาด ตั้งเป้าเป็นช่วงและวัดผล' : 'ระวังโอกาสลวง ตั้งเกณฑ์ประเมินก่อนตัดสินใจ เพื่อลดความเสี่ยง',
    emotion: positive ? 'พลังใจดี แต่รักษาโทนสื่อสารให้นุ่มนวล จะได้ผลลัพธ์ที่ดีกว่า' : 'เรื่องอารมณ์–ความขัดแย้ง แนะนำฝึกฟังเชิงลึก/เว้นช่วงก่อนตอบ',
    finance: positive ? 'วินัยการเงินดี ยึดงบ–ติดตามรายจ่ายต่อเนื่อง ช่วยสะสมผลลัพธ์' : 'เงินรั่ว/งานหนัก จัดลำดับสำคัญ–กระจายงาน และตั้งวันพัก',
    harmony: positive ? 'ความกลมเกลียว–ความสัมพันธ์ดี เหมาะงานทีม/ดูแลลูกค้า ใช้ข้อได้เปรียบนี้เชิงรุก' : 'ดูแลขอบเขต–การคุยคาดหวังร่วม เพื่อลดแรงเสียดทาน',
    attraction: positive ? 'แรงดึงดูด/งานแบรนด์–คอนเทนต์ไปได้ดี วางคอนเทนต์สม่ำเสมอเพิ่มการรับรู้' : 'วางกรอบแบรนด์–ข้อความหลักให้ชัด เพื่อลดความกระจัดกระจาย',
    other: positive ? 'โดยรวมเอื้อต่อการงาน/ความสัมพันธ์ ต่อยอดจุดแข็งด้วยเป้าหมายรายสัปดาห์และติดตามผล' : 'มีจุดควรระวัง เพิ่มโครงสร้าง (ตาราง/งบประมาณ) และรีวิวเป็นช่วง ๆ เพื่อลดผลกระทบ',
  };

  const en = {
    charm: positive ? 'Strength in communication/charm; network to raise close rates.' : 'Mind miscommunication; use agendas/summaries.',
    communication: positive ? 'Strength in communication/charm; network to raise close rates.' : 'Mind miscommunication; use agendas/summaries.',
    mentorship: positive ? 'Supported by seniors; ask reviews to accelerate.' : 'Avoid over-reliance; build self-sufficiency.',
    influence: positive ? 'Good influence; blend clarity with empathy.' : 'Avoid pressure; invite collaboration with reasons.',
    stability: positive ? 'Supports stability/balance; plan long-term.' : 'Reduce plan swings with weekly reviews.',
    opportunity: positive ? 'Opportunities/growth; phase goals and measure.' : 'Beware false positives; define criteria first.',
    emotion: positive ? 'Good morale; keep tone gentle.' : 'Emotion/clashes; pause and actively listen.',
    finance: positive ? 'Financial discipline; stick to budgets.' : 'Money churn/overwork; prioritize/delegate/rest.',
    harmony: positive ? 'Harmony/relationships; great for teamwork.' : 'Clarify boundaries/expectations.',
    attraction: positive ? 'Attraction/branding/content excels.' : 'Clarify brand frame and core messaging.',
    other: positive ? 'Generally supportive; track weekly goals.' : 'Add structure and periodic reviews.',
  };

  const messages = locale === 'th' ? th : en;
  return messages[cat as keyof typeof messages] || '';
}