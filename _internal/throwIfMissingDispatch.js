function throwIfMissingDispatch(dispatch) {
  if (!dispatch || typeof dispatch !== 'function') {
    throw new Error(
      'Cannot find store.dispatch.' +
        "This function requires that redux-wasp's middleware " +
        "be added to redux's createStore() method" +
        'before using it.'
    );
  }
}

module.exports = throwIfMissingDispatch;
