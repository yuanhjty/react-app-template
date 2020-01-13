const actionTypes = new Set();

export function createActionType(type) {
  if (!actionTypes.has(type)) {
    actionTypes.add(type);
  } else {
    console.warn(`Action type [${type}] already exists!`);
  }
  return type;
}

export default function createAction(type, creator) {
  const actionType = createActionType(type);

  function actionCreator(...args) {
    const action = typeof creator === 'function' ? creator(...args) : creator;
    return {
      type: actionType,
      ...action,
    };
  }

  actionCreator.type = actionType;
  actionCreator.toString = () => actionType;
  return actionCreator;
}
