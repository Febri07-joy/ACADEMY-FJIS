/* FJIS TKA PACKAGE 2 — ADDITIVE ONLY
   Copy this TXT content into paket-2-addon.js.
   Package 1 is not overwritten.
*/
window.FJIS_TKA_PACKAGE_2_BANK = window.FJIS_TKA_PACKAGE_2_BANK || {};
window.FJIS_TKA_PACKAGE_2_CODE = "FJIS-TKA-2026-002";
window.FJIS_TKA_PACKAGE_2_STATUS = "READY_FROM_ORIGINAL_SOURCES";

(function(){
  const originalValidate = window.validateFJISTKAAccessCode;
  if (typeof originalValidate === "function") {
    window.validateFJISTKAAccessCode = function(code){
      const normalized = String(code || "").trim().toUpperCase();
      if (normalized === window.FJIS_TKA_PACKAGE_2_CODE) {
        window.FJIS_TKA_ACTIVE_PACKAGE_CODE = normalized;
        return { valid:true, package:{ code:normalized, active:true, packageId:"paket-2", title:"TKA Kelas 12 — Paket 2" } };
      }
      const result = originalValidate(code);
      if (result && result.valid) window.FJIS_TKA_ACTIVE_PACKAGE_CODE = normalized;
      return result;
    };
  }

  const originalGet = window.getFJISTKAQuestions;
  if (typeof originalGet === "function") {
    window.getFJISTKAQuestions = function(subjectId){
      if (window.FJIS_TKA_ACTIVE_PACKAGE_CODE === window.FJIS_TKA_PACKAGE_2_CODE) {
        const bank = window.FJIS_TKA_PACKAGE_2_BANK[subjectId];
        return Array.isArray(bank) ? bank.map(q => ({...q})) : [];
      }
      return originalGet(subjectId);
    };
  }
})();
