import { useDispatch, useSelector } from "react-redux";
import { loadContractInfo, systemSelector } from "store/systemReducer";
import { useEffect } from "react";

const ContractProvider = ({ children }) => {
  const { ddContractInfo } = useSelector(systemSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ddContractInfo) {
      dispatch(loadContractInfo());
    }
  }, [ddContractInfo, dispatch]);

  return ddContractInfo ? children : null;
};

export default ContractProvider;
