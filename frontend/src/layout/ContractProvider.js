import {useDispatch, useSelector} from "react-redux";
import {setDDContractData, systemSelector} from "store/systemReducer";
import {useEffect} from "react";
import axios from "axios";

const getContractData = () => async dispatch => {
  try {
    const { data } = await axios.get(`/api/get_contract`)
    dispatch(setDDContractData(data))
  }
  catch (e) {
    console.error("Failed to get contract data!!!!", e)
  }
}

const ContractProvider = ({ children }) => {

  const { ddContractData } = useSelector(systemSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!ddContractData) {
      dispatch(getContractData())
    }
  }, [ddContractData, dispatch])

  return ddContractData ? children : null
}

export default ContractProvider