import { useDispatch } from "react-redux";
import isFunction from "lodash/isFunction";

const useActionDispatch = () => {
  const dispatch = useDispatch();

  return async (action, actionKey) => {
    dispatch({
      type: "ACTION_STATUS.PENDING",
      payload: { actionKey },
    });

    try {
      if (isFunction(action)) {
        await action(dispatch);
      } else {
        dispatch(action);
      }

      // wait for next tick to give the components time to react
      setTimeout(() => {
        dispatch({
          type: "ACTION_STATUS.SUCCESS",
          payload: { actionKey },
        });
      }, 0);
    } catch (e) {
      console.error("useActionDispatch Failed", { e });
      dispatch({
        type: "ACTION_STATUS.ERROR",
        payload: { actionKey },
      });
    }
  };
};

export default useActionDispatch;
