import { Bus } from '../../../../../types/busApply/busApply.type';
import * as S from './style';

interface Props {
  data: Bus;
  isSelect: boolean;
  onChangeApplyBus: (busId: number) => void;
}

const BusOption = ({ data, isSelect, onChangeApplyBus }: Props) => {
  const [busNumber, busName] = data.busName.split(' ');

  return (
    <S.BusOptionWrap isSelect={isSelect} onClick={() => onChangeApplyBus(data.id)}>
      {busNumber === '미탑승' ? (
        <>
          <S.BusOptionStationText isSelect={isSelect}>{busNumber}</S.BusOptionStationText>
          <S.BusOptionStationText isSelect={isSelect}>
            ({data.leaveTime.split(' ')[1].substring(0, 5)})
          </S.BusOptionStationText>
        </>
      ) : (
        <>
          <S.BusOptionStationText isSelect={isSelect}>{busNumber}   {data.applyCount}/{data.peopleLimit}</S.BusOptionStationText>
          <S.BusOptionStationText isSelect={isSelect}>{busName}</S.BusOptionStationText>
          <S.BusOptionStationText isSelect={isSelect}>
            ({data.leaveTime.split(' ')[1].substring(0, 5)})
          </S.BusOptionStationText>
        </>
      )}
    </S.BusOptionWrap>
  );
};

export default BusOption;
