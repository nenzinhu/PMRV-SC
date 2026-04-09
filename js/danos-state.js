window.PMRV = window.PMRV || {};

PMRV.danosState = (function() {
  function clearAll(createMotoDb) {
    return {
      currentDamages: {},
      currentVehicle: null,
      motoDb: createMotoDb(),
      motoEditId: null,
      motoTab: 'frente',
      savedVehicles: []
    };
  }

  function selectVehicle(state, vehicleType, uses360, createMotoDb) {
    return {
      currentDamages: {},
      currentVehicle: vehicleType,
      motoDb: uses360(vehicleType) ? createMotoDb() : state.motoDb,
      motoEditId: null,
      motoTab: uses360(vehicleType) ? 'frente' : state.motoTab,
      savedVehicles: state.savedVehicles
    };
  }

  function saveCurrentVehicle(state, snapshot) {
    return {
      currentDamages: {},
      currentVehicle: null,
      motoDb: state.motoDb,
      motoEditId: null,
      motoTab: state.motoTab,
      savedVehicles: [...state.savedVehicles, snapshot]
    };
  }

  function removeSavedVehicle(state, index) {
    return {
      currentDamages: state.currentDamages,
      currentVehicle: state.currentVehicle,
      motoDb: state.motoDb,
      motoEditId: state.motoEditId,
      motoTab: state.motoTab,
      savedVehicles: state.savedVehicles.filter((_, savedIndex) => savedIndex !== index)
    };
  }

  function resetMotoInspection(state, createMotoDb) {
    return {
      currentDamages: state.currentDamages,
      currentVehicle: state.currentVehicle,
      motoDb: createMotoDb(),
      motoEditId: null,
      motoTab: 'frente',
      savedVehicles: state.savedVehicles
    };
  }

  function setMotoTab(state, tab) {
    return {
      currentDamages: state.currentDamages,
      currentVehicle: state.currentVehicle,
      motoDb: state.motoDb,
      motoEditId: state.motoEditId,
      motoTab: tab,
      savedVehicles: state.savedVehicles
    };
  }

  function setMotoEditId(state, editId) {
    return {
      currentDamages: state.currentDamages,
      currentVehicle: state.currentVehicle,
      motoDb: state.motoDb,
      motoEditId: editId,
      motoTab: state.motoTab,
      savedVehicles: state.savedVehicles
    };
  }

  return {
    clearAll,
    removeSavedVehicle,
    resetMotoInspection,
    saveCurrentVehicle,
    selectVehicle,
    setMotoEditId,
    setMotoTab
  };
})();
