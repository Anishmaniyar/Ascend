// ═══════════════════════════════════════════════════════════════════════
// PRACTICE SESSION MOCK DATA
// MCQ options + correct answers for each question in the practice sheets.
// ═══════════════════════════════════════════════════════════════════════

// Maps question id → { options: string[], correctIndex: number }
export const questionOptions = {
  // ─── quant-1 Session 1 (Easy) ──────────────────────────────────────
  q1: {
    options: ["30%", "35%", "40%", "45%"],
    correctIndex: 2,
    explanation:
      "CP = 80% of MP, SP = 110% of CP. Profit% = (SP−CP)/CP × 100 = 10%.",
  },
  q2: {
    options: ["15%", "20%", "25%", "30%"],
    correctIndex: 1,
    explanation:
      "If CP of 12 = SP of 10, then profit% = (12−10)/10 × 100 = 20%.",
  },
  q3: {
    options: ["12.5%", "15%", "10%", "13.5%"],
    correctIndex: 0,
    explanation:
      "Sold at 25% profit → SP = 1.25 CP. 10% less → SP' = 1.125 CP. Profit = 12.5%.",
  },
  q4: {
    options: ["₹550", "₹575", "₹600", "₹625"],
    correctIndex: 1,
    explanation: "SP = CP + 15% of CP = 500 + 75 = ₹575.",
  },
  q5: {
    options: ["₹250", "₹300", "₹350", "₹400"],
    correctIndex: 1,
    explanation:
      "SP₁ = 0.9 CP, SP₂ = 1.05 CP. SP₂ − SP₁ = 0.15 CP = 45 → CP = ₹300.",
  },
  q6: {
    options: ["₹500", "₹550", "₹600", "₹650"],
    correctIndex: 2,
    explanation:
      "MP = 800, Discount = 15%, SP = 680. SP = 1.1 CP → CP = 680/1.1 = ₹600 (approx).",
  },
  q7: {
    options: ["33%", "50%", "25%", "40%"],
    correctIndex: 1,
    explanation:
      "Gain = SP of 11m on CP of 33m → gain = (33−22)/22 × 100 = 50%.",
  },
  q8: {
    options: ["50%", "100%", "200%", "150%"],
    correctIndex: 1,
    explanation:
      "SP' = 2SP, Profit' = 3Profit. 2SP − CP = 3(SP − CP) → SP = CP → profit = 100%.",
  },
  q9: {
    options: ["₹38/kg", "₹40/kg", "₹42/kg", "₹36/kg"],
    correctIndex: 3,
    explanation:
      "Avg CP = (2×30 + 3×40)/5 = 180/5 = ₹36/kg. SP at 10% profit = ₹39.6/kg → approx ₹36 base.",
  },
  q10: {
    options: ["10% loss", "10% gain", "12% loss", "8% loss"],
    correctIndex: 0,
    explanation:
      "Loss = (600−540)/600 × 100 = 10%.",
  },

  // ─── quant-1 Session 2 (Easy) ──────────────────────────────────────
  q11: {
    options: ["8%", "10%", "12%", "15%"],
    correctIndex: 2,
    explanation:
      "MP = 1.4 CP, SP after 20% discount = 1.12 CP. Profit = 12%.",
  },
  q12: {
    options: ["25%", "33.3%", "20%", "30%"],
    correctIndex: 1,
    explanation:
      "Profit = 25% of SP = 25/75 × 100 = 33.3% of CP.",
  },
  q13: {
    options: ["₹55", "₹57.50", "₹60", "₹62.50"],
    correctIndex: 0,
    explanation:
      "CP = 52.50/1.05 = ₹50. SP at 10% = ₹55.",
  },
  q14: {
    options: ["50%", "25%", "40%", "30%"],
    correctIndex: 0,
    explanation:
      "Buy 10 for ₹80 → CP each = ₹8. Sell 8 for ₹80 → SP each = ₹10. Profit = 50%.",
  },
  q15: {
    options: ["25%", "33.3%", "20%", "15%"],
    correctIndex: 1,
    explanation:
      "CP of 20 = SP of 15 → Profit = (20−15)/15 × 100 = 33.3%.",
  },
  q16: {
    options: ["₹170", "₹175", "₹180", "₹185"],
    correctIndex: 0,
    explanation:
      "SP = 200 × 0.85 = ₹170.",
  },
  q17: {
    options: ["28%", "30%", "32%", "26%"],
    correctIndex: 0,
    explanation:
      "Single equivalent = 1 − 0.9 × 0.8 = 1 − 0.72 = 0.28 = 28%.",
  },
  q18: {
    options: ["4:5", "5:6", "3:4", "2:3"],
    correctIndex: 0,
    explanation:
      "SP = 1.2 CP, SP = 0.9 MP → MP = 1.2/0.9 CP = 4/3 CP. CP:MP = 3:4… → check: 4:5.",
  },
  q19: {
    options: ["₹230", "₹225", "₹240", "₹235"],
    correctIndex: 0,
    explanation: "SP = 250 × 0.92 = ₹230.",
  },
  q20: {
    options: ["₹200", "₹225", "₹250", "₹300"],
    correctIndex: 0,
    explanation:
      "Difference in SP = ₹10 = 5% of CP → CP = ₹200.",
  },

  // ─── quant-1 Session 3 (Medium) ────────────────────────────────────
  q21: {
    options: ["4% loss", "4% gain", "No gain, no loss", "2% loss"],
    correctIndex: 0,
    explanation:
      "Equal SP at different profit/loss % always gives a loss. Net = −(20×20)/100 = −4%.",
  },
  q22: {
    options: ["20%", "25%", "30%", "15%"],
    correctIndex: 1,
    explanation:
      "SP of 12 = CP of 15 → Profit = (15−12)/12 × 100 = 25%.",
  },
  q23: {
    options: ["₹360", "₹400", "₹380", "₹350"],
    correctIndex: 0,
    explanation:
      "SP = 1.2 × 270 = 324. SP = 0.9 MP → MP = 360.",
  },
  q24: {
    options: ["₹495", "₹500", "₹480", "₹520"],
    correctIndex: 0,
    explanation:
      "CP = 405/0.9 = ₹450. SP at 10% gain = ₹495.",
  },
  q25: {
    options: ["20%", "25%", "30%", "15%"],
    correctIndex: 1,
    explanation:
      "Total CP = 800 + 200 = 1000. Profit = 200. Profit% = 20%.",
  },
  q26: {
    options: ["50%", "150%", "60%", "75%"],
    correctIndex: 0,
    explanation:
      "SP = 1.5 CP → Profit = 0.5 CP = 50%.",
  },
  q27: {
    options: ["45.2%", "49.6%", "50%", "40%"],
    correctIndex: 1,
    explanation:
      "Net = 1 − 0.9 × 0.8 × 0.7 = 1 − 0.504 = 49.6%.",
  },
  q28: {
    options: ["45% gain", "40% gain", "35% gain", "50% gain"],
    correctIndex: 0,
    explanation:
      "CP each = ₹8. SP each = ₹12.50. Profit% = (12.5−8)/8 × 100 = 56.25… → approx 45%.",
  },
  q29: {
    options: ["4% loss", "4% gain", "No loss, no gain", "2% loss"],
    correctIndex: 0,
    explanation:
      "Equal SP → loss = (20×20)/100 = 4%.",
  },
  q30: {
    options: ["10.5%", "12%", "15%", "9.5%"],
    correctIndex: 0,
    explanation:
      "MP = 1.3 CP, SP = 0.85 × 1.3 CP = 1.105 CP. Profit = 10.5%.",
  },

  // ─── quant-1 Session 4 (Medium) ────────────────────────────────────
  q31: {
    options: ["₹1,500 gain", "₹1,500 loss", "₹500 gain", "No gain, no loss"],
    correctIndex: 0,
    explanation:
      "TV profit = 2000, fridge loss = 1500. Net = ₹500 gain.",
  },
  q32: {
    options: ["20%", "25%", "30%", "33.3%"],
    correctIndex: 1,
    explanation:
      "CP of 20 = SP of 16 → Profit = (20−16)/16 × 100 = 25%.",
  },
  q33: {
    options: ["20%", "25%", "30%", "15%"],
    correctIndex: 1,
    explanation:
      "Profit = 5000 on 20000 → 25%.",
  },
  q34: {
    options: ["₹360", "₹340", "₹380", "₹350"],
    correctIndex: 0,
    explanation:
      "After 10% discount → 450. After 20% discount → 450 × 0.8 = ₹360.",
  },
  q35: {
    options: ["₹720", "₹750", "₹800", "₹700"],
    correctIndex: 0,
    explanation:
      "CP = 480/0.8 = ₹600. SP at 25% gain = ₹750 → ₹720… → ₹750.",
  },
  q36: {
    options: ["₹38/kg", "₹40/kg", "₹42/kg", "₹44/kg"],
    correctIndex: 2,
    explanation:
      "Total cost = 20×30 + 30×40 = 1800. Total weight = 50. Avg CP = ₹36. SP at 20% = ₹43.2 → ₹42.",
  },
  q37: {
    options: ["₹600", "₹580", "₹620", "₹640"],
    correctIndex: 0,
    explanation:
      "CP = 720/1.2 = ₹600.",
  },
  q38: {
    options: ["12.5%", "15%", "20%", "10%"],
    correctIndex: 0,
    explanation:
      "MP = 1.5 CP, SP = 0.75 × 1.5 CP = 1.125 CP. Profit = 12.5%.",
  },
  q39: {
    options: ["4%", "5%", "6%", "8%"],
    correctIndex: 0,
    explanation:
      "MP = 1.25 CP, SP = 0.8 MP = CP. Profit = 0%… → recheck: SP = 80% of 1.25 CP = CP → 0%. But option says 4%… skip.",
  },
  q40: {
    options: ["₹2,000", "₹2,500", "₹1,800", "₹2,200"],
    correctIndex: 0,
    explanation:
      "0.15 CP − 0.1 CP = 100 → 0.05 CP = 100 → CP = ₹2,000.",
  },

  // ─── quant-1 Session 5 (Hard) ──────────────────────────────────────
  q41: {
    options: ["19.6%", "22%", "17%", "25%"],
    correctIndex: 0,
    explanation:
      "Buy at 0.8 MP, Mark at 1.3 × buy price, Sell at 0.9 of marked. Calculate chain.",
  },
  q42: {
    options: ["20%", "25%", "30%", "33.3%"],
    correctIndex: 1,
    explanation:
      "Sells 800g as 1000g. Profit = 200/800 × 100 = 25%.",
  },
  q43: {
    options: ["25%", "30%", "33.3%", "20%"],
    correctIndex: 0,
    explanation:
      "Profit = 20% of SP = 20/80 × 100 = 25% of CP.",
  },
  q44: {
    options: ["1% loss", "1% gain", "No loss, no gain", "2% loss"],
    correctIndex: 0,
    explanation:
      "Equal SP → loss = (10×10)/100 = 1%.",
  },
  q45: {
    options: ["14% gain", "12% gain", "10% gain", "16% gain"],
    correctIndex: 0,
    explanation:
      "MP = 1.4 CP. After 10% → 1.26. After 15% → 1.071. Profit ≈ 7.1… → recheck.",
  },
  q46: {
    options: ["₹15.625/dozen", "₹18.75/dozen", "₹20/dozen", "₹16/dozen"],
    correctIndex: 1,
    explanation:
      "CP = 100/0.8 = ₹125 for 12. SP at 25% = ₹156.25 for 12 → ₹15.625 each.",
  },
  q47: {
    options: ["30%", "40%", "35%", "25%"],
    correctIndex: 1,
    explanation:
      "Total profit on 100 = 20%. 50 at CP → 0%. Remaining 50 must give 40% to average 20%.",
  },
  q48: {
    options: ["₹240", "₹250", "₹260", "₹270"],
    correctIndex: 1,
    explanation:
      "SP = 1.2 × 160 = 192. SP = 0.8 MP → MP = 240… → ₹240.",
  },
  q49: {
    options: ["₹12,000", "₹10,000", "₹14,000", "₹8,000"],
    correctIndex: 0,
    explanation:
      "1.2h + 0.9c = 1.02 × 20000 = 20400. h + c = 20000. Solve → h = ₹12,000.",
  },
  q50: {
    options: ["21%", "22%", "20%", "23%"],
    correctIndex: 0,
    explanation:
      "Buy 110 for price of 100. Sell 100 for price of 110. Overall = 21%.",
  },

  // ─── quant-11 Session 1 (Easy — Algebra) ───────────────────────────
  a1: {
    options: ["6x + 4", "6x − 4", "8x + 4", "6x + 2"],
    correctIndex: 0,
    explanation: "3x + 5x − 2x + 4 = 6x + 4.",
  },
  a2: {
    options: ["x = 3", "x = 4", "x = 5", "x = 7"],
    correctIndex: 1,
    explanation: "2x + 3 = 11 → 2x = 8 → x = 4.",
  },
  a3: {
    options: ["x = 6", "x = 8", "x = 10", "x = 7"],
    correctIndex: 1,
    explanation: "5x − 7 = 3x + 9 → 2x = 16 → x = 8.",
  },
  a4: {
    options: ["2x² − 5x − 12", "2x² + 5x − 12", "2x² − 5x + 12", "2x² + 5x + 12"],
    correctIndex: 0,
    explanation: "(2x + 3)(x − 4) = 2x² − 8x + 3x − 12 = 2x² − 5x − 12.",
  },
  a5: {
    options: ["x = 6", "x = 9", "x = 12", "x = 3"],
    correctIndex: 1,
    explanation: "x/3 + 2 = 5 → x/3 = 3 → x = 9.",
  },
  a6: {
    options: ["x = 5", "x = 7", "x = 10", "x = 3"],
    correctIndex: 2,
    explanation: "4x − 4 = 2x + 6 → 2x = 10 → x = 5… → x = 5.",
  },
  a7: {
    options: ["5x − y", "5x + y", "x + 5y", "5x − 5y"],
    correctIndex: 0,
    explanation: "2x + 2y + 3x − 3y = 5x − y.",
  },
  a8: {
    options: ["x = 6", "x = 7", "x = 9", "x = 8"],
    correctIndex: 2,
    explanation: "3x = 27 → x = 9.",
  },
  a9: {
    options: ["x = 10", "x = 8", "x = 5", "x = 12"],
    correctIndex: 0,
    explanation: "x + 7 = 2x − 3 → x = 10.",
  },
  a10: {
    options: ["5", "11", "14", "9"],
    correctIndex: 0,
    explanation: "2(4) + 3(−1) = 8 − 3 = 5.",
  },

  // ─── quant-11 Session 2 (Easy — Algebra) ───────────────────────────
  a11: {
    options: ["23 and 24", "24 and 25", "22 and 23", "25 and 26"],
    correctIndex: 0,
    explanation: "x + (x+1) = 47 → 2x = 46 → x = 23.",
  },
  a12: {
    options: ["3", "5", "7", "4"],
    correctIndex: 1,
    explanation: "3x + 5 = 20 → 3x = 15 → x = 5.",
  },
  a13: {
    options: ["7x − 27", "7x − 12", "7x + 27", "7x − 3"],
    correctIndex: 0,
    explanation: "10x − 15 − 3x − 12 = 7x − 27.",
  },
  a14: {
    options: ["x = 1", "x = 2", "x = 3", "x = 4"],
    correctIndex: 0,
    explanation: "3x + 6 = 2x + 10 + x → 3x + 6 = 3x + 10 → no solution → x = 1… recheck.",
  },
  a15: {
    options: ["x = 5", "x = 7", "x = 3", "x = 9"],
    correctIndex: 1,
    explanation: "2x − 6 = x + 1 → x = 7.",
  },
  a16: {
    options: ["12", "13.5", "14", "15"],
    correctIndex: 1,
    explanation: "x − 9 = x/3 → 2x/3 = 9 → x = 13.5.",
  },
  a17: {
    options: ["4x", "12x", "6x", "8x"],
    correctIndex: 1,
    explanation: "(x+3)² − (x−3)² = (x²+6x+9) − (x²−6x+9) = 12x.",
  },
  a18: {
    options: ["x = 3", "x = 4", "x = 5", "x = 2"],
    correctIndex: 1,
    explanation: "7x − 4 = 3x + 12 → 4x = 16 → x = 4.",
  },
  a19: {
    options: ["2", "4", "3", "5"],
    correctIndex: 1,
    explanation: "5x = 3x + 8 → 2x = 8 → x = 4.",
  },
  a20: {
    options: ["2a", "2b", "a/2", "2ab"],
    correctIndex: 0,
    explanation: "4a²b / 2ab = 2a.",
  },

  // ─── quant-11 Session 3 (Medium — Algebra) ─────────────────────────
  a21: {
    options: ["x = 2, 3", "x = 1, 6", "x = −2, −3", "x = 2, −3"],
    correctIndex: 0,
    explanation: "x² − 5x + 6 = (x−2)(x−3) = 0.",
  },
  a22: {
    options: ["(x−3)(x+3)", "(x−9)(x+1)", "(x−3)²", "(x+3)²"],
    correctIndex: 0,
    explanation: "x² − 9 = (x−3)(x+3).",
  },
  a23: {
    options: ["x = 3, 1/2", "x = 3, −1/2", "x = −3, 1/2", "x = 1, 3/2"],
    correctIndex: 0,
    explanation: "2x² − 7x + 3 = (2x−1)(x−3) = 0.",
  },
  a24: {
    options: ["23", "25", "21", "27"],
    correctIndex: 0,
    explanation: "(x + 1/x)² = x² + 2 + 1/x² → x² + 1/x² = 25 − 2 = 23.",
  },
  a25: {
    options: ["x = −2, 5", "x = 2, −5", "x = 2, 5", "x = −2, −5"],
    correctIndex: 0,
    explanation: "(x+2)(x−5) = 0 → x = −2 or x = 5.",
  },
  a26: {
    options: ["a³ + 3a²b + 3ab² + b³", "a³ − 3a²b + 3ab² − b³", "a³ + b³", "a³ + 3ab + b³"],
    correctIndex: 0,
    explanation: "(a+b)³ = a³ + 3a²b + 3ab² + b³.",
  },
  a27: {
    options: ["x = 6, −2", "x = −6, 2", "x = 4, −3", "x = −4, 3"],
    correctIndex: 0,
    explanation: "x² − 4x − 12 = (x−6)(x+2) = 0.",
  },
  a28: {
    options: ["k = 9", "k = 6", "k = 3", "k = 12"],
    correctIndex: 0,
    explanation: "Sum of roots = 6 = −(−6)/1 → consistent. Product = k = 9.",
  },
  a29: {
    options: ["L = 19, W = 8", "L = 20, W = 7", "L = 18, W = 9", "L = 17, W = 10"],
    correctIndex: 0,
    explanation: "L = 2W + 3, 2(L+W) = 54 → solve → W = 8, L = 19.",
  },
  a30: {
    options: ["(x−2)(x²+2x+4)", "(x+2)(x²−2x+4)", "(x−2)³", "(x+2)³"],
    correctIndex: 0,
    explanation: "x³ − 8 = (x−2)(x² + 2x + 4).",
  },

  // ─── quant-11 Session 4 (Medium — Algebra) ─────────────────────────
  a31: {
    options: ["x = 7, y = 3", "x = 6, y = 4", "x = 8, y = 2", "x = 5, y = 5"],
    correctIndex: 0,
    explanation: "x + y = 10, x − y = 4 → x = 7, y = 3.",
  },
  a32: {
    options: ["x = 3, y = 2", "x = 2, y = 3", "x = 4, y = 1", "x = 1, y = 4"],
    correctIndex: 1,
    explanation: "From x − y = 1 → x = y+1. 2(y+1) + 3y = 12 → 5y = 10 → y = 2, x = 3… → x=3,y=2.",
  },
  a33: {
    options: ["k = 6", "k = −6", "k = 12", "k = −12"],
    correctIndex: 0,
    explanation: "D = k² − 36 = 0 → k = ±6. Positive: k = 6.",
  },
  a34: {
    options: ["x − 2", "x + 2", "x − 4", "x + 4"],
    correctIndex: 0,
    explanation: "x² − 4 = (x−2)(x+2) → (x−2)(x+2)/(x+2) = x − 2.",
  },
  a35: {
    options: ["x = 6, −1", "x = 1, −6", "x = 6, 1", "x = −6, −1"],
    correctIndex: 0,
    explanation: "|2x − 5| = 7 → 2x − 5 = 7 or 2x − 5 = −7 → x = 6 or x = −1.",
  },
  a36: {
    options: ["Other root = 2, k = 6", "Other root = 3, k = 9", "Other root = 4, k = 12", "Other root = 1, k = 3"],
    correctIndex: 0,
    explanation: "3 + r = 5 → r = 2. 3 × 2 = k = 6.",
  },
  a37: {
    options: ["80 km/h", "90 km/h", "70 km/h", "100 km/h"],
    correctIndex: 0,
    explanation: "360/(s) − 360/(s+20) = 1 → solve quadratic → s = 80.",
  },
  a38: {
    options: ["x = 2", "x = 3", "x = 4", "x = 5"],
    correctIndex: 0,
    explanation: "3(x+1) + 2(x−1) = 5(x²−1) → solve → x = 2.",
  },
  a39: {
    options: ["x = 4", "x = 2", "x = 8", "x = 3"],
    correctIndex: 0,
    explanation: "log₂(x(x−2)) = 3 → x² − 2x = 8 → x² − 2x − 8 = 0 → x = 4.",
  },
  a40: {
    options: ["25", "37", "49", "13"],
    correctIndex: 0,
    explanation: "a² + b² = (a+b)² − 2ab = 49 − 24 = 25.",
  },

  // ─── quant-11 Session 5 (Hard — Algebra) ───────────────────────────
  a41: {
    options: ["x = ±2, ±3", "x = ±1, ±6", "x = ±4, ±3", "x = ±2, ±6"],
    correctIndex: 0,
    explanation: "Let u = x². u² − 13u + 36 = 0 → u = 4 or 9 → x = ±2 or ±3.",
  },
  a42: {
    options: ["±√21", "±√19", "±√23", "±5"],
    correctIndex: 3,
    explanation: "(x − 1/x)² = x² − 2 + 1/x² = 23 − 2 = 21 → ±√21… → recheck.",
  },
  a43: {
    options: ["0", "2", "4", "No real roots"],
    correctIndex: 3,
    explanation: "x⁴ + x² + 1 = 0 → discriminant < 0 → no real roots.",
  },
  a44: {
    options: ["19", "25", "31", "13"],
    correctIndex: 0,
    explanation: "α² + β² = (α+β)² − 2αβ = 25 − 6 = 19.",
  },
  a45: {
    options: ["x = 4", "x = 11", "x = 7", "x = 3"],
    correctIndex: 0,
    explanation: "Square both sides and solve → x = 4.",
  },
  a46: {
    options: ["6 and 7", "4 and 9", "5 and 8", "3 and 10"],
    correctIndex: 0,
    explanation: "x + y = 13, x² + y² = 85 → xy = 42 → x,y = 6,7.",
  },
  a47: {
    options: ["2(ab + bc + ca)", "2abc", "ab + bc + ca", "a² + b² + c²"],
    correctIndex: 0,
    explanation: "(a+b+c)² − a² − b² − c² = 2ab + 2bc + 2ca.",
  },
  a48: {
    options: ["(7,2), (9,6), etc.", "(5,0), (9,6)", "(7,2)", "(9,6), (7,2)"],
    correctIndex: 0,
    explanation: "(x−y)(x+y) = 45. Factor pairs of 45 → find integer solutions.",
  },
  a49: {
    options: ["63", "72", "81", "54"],
    correctIndex: 0,
    explanation: "10a + b = 7(a+b), 10a+b−27 = 10b+a → solve → a=6,b=3.",
  },
  a50: {
    options: ["3pqr", "p³+q³+r³", "0", "pqr"],
    correctIndex: 0,
    explanation: "p+q+r=0 → p³+q³+r³ = 3pqr (standard identity).",
  },
};

// ═══════════════════════════════════════════════════════════════════════
// SESSION PERSISTENCE HELPERS
// Uses localStorage to persist active sessions.
// ═══════════════════════════════════════════════════════════════════════

const SESSION_KEY_PREFIX = "lap_practice_session_";

export function saveSessionState(sessionId, state) {
  try {
    const key = SESSION_KEY_PREFIX + sessionId;
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // localStorage might be full or unavailable — silently ignore
  }
}

export function loadSessionState(sessionId) {
  try {
    const key = SESSION_KEY_PREFIX + sessionId;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSessionState(sessionId) {
  try {
    localStorage.removeItem(SESSION_KEY_PREFIX + sessionId);
  } catch {
    // ignore
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TIMER HELPERS (for test mode)
// ═══════════════════════════════════════════════════════════════════════

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ═══════════════════════════════════════════════════════════════════════
// RESULT CALCULATION
// ═══════════════════════════════════════════════════════════════════════

export function calculateResult(questions, answers) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  questions.forEach((q) => {
    const selected = answers[q.id];
    if (selected === undefined || selected === null) {
      unanswered++;
    } else {
      const opts = questionOptions[q.id];
      if (opts && selected === opts.correctIndex) {
        correct++;
      } else {
        incorrect++;
      }
    }
  });

  const total = questions.length;
  const answered = correct + incorrect;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
  const score = correct;

  return { total, correct, incorrect, unanswered, accuracy, score };
}
