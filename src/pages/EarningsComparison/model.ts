import { useCallback, useMemo, useState } from 'react';
import { exception, initialData } from './data';

function verifyKeyValueSum(keys: string[], data: Record<string, any>[], type: string) {
  const sumKeysValues = keys.slice(0, -1).reduce((accumulator, currentKey) => {
    const currentItem = data.find((item) => item.key === currentKey);
    return accumulator + (currentItem ? currentItem.value1 : 0);
  }, 0);

  const resultKey = keys[keys.length - 1];
  const resultValue = data.find((item) => item.key === resultKey)?.[type];

  return sumKeysValues === resultValue;
}

function validateEquations(
  data: Array<{ key: string; value1: number }>,
  exceptionData: Record<string, any>[],
  type: string,
) {
  exceptionData?.forEach((item) => {
    if (!item.equation) {
      item.passes = true;
      return;
    }
    switch (item.equation.type) {
      case 'add':
        {
          const passes = verifyKeyValueSum(item.equation.keysToVerify, data, type);
          item.passes = passes;
        }
        break;
    }
  });

  return exceptionData;
}

type FinancialDataItem = {
  key: string;
  type: string;
  value1: number;
  value2: number;
  value3: number;
};

const initialPeriods = '2024-03';
export default function Page() {
  const [periods, setPeriods] = useState(initialPeriods);
  const [data, setData] = useState(initialData);
  const [exceptionType, setExceptionType] = useState<string>('value1');

  const exceptionData: Array<Record<string, any>> = useMemo(() => {
    const arr = data[periods];
    return validateEquations(arr, exception, exceptionType) || [];
  }, [periods, data, exceptionType]);

  // 新增记录
  const addRecord = useCallback(
    (dateKey: string, newItem: FinancialDataItem) => {
      setData((prevData) => ({
        ...prevData,
        [dateKey]: [...(prevData[dateKey] || []), newItem],
      }));
    },
    [setData],
  );
  // 删除记录
  const removeRecord = useCallback(
    (dateKey: string, recordKey: string) => {
      setData((prevData) => ({
        ...prevData,
        [dateKey]: prevData[dateKey]?.filter((item) => item.key !== recordKey),
      }));
    },
    [setData],
  );
  // 更新记录
  const updateRecord = useCallback(
    (dateKey: string, updatedItem: FinancialDataItem) => {
      setData((prevData) => ({
        ...prevData,
        [dateKey]: prevData[dateKey]?.map((item) =>
          item.key === updatedItem.key ? { ...item, ...updatedItem } : item,
        ),
      }));
    },
    [setData],
  );
  // 修改多条数据
  const updateRecords = useCallback(
    (dateKey: string, itemsToUpdate: FinancialDataItem[]) => {
      setData((prevData) => {
        return {
          ...prevData,
          [dateKey]: prevData[dateKey]?.map((item) => {
            const updatedItem = itemsToUpdate.find((i) => i.key === item.key);
            if (updatedItem) {
              return { ...item, ...updatedItem };
            }
            return item;
          }),
        };
      });
    },
    [setData],
  );

  return {
    data,
    addRecord,
    removeRecord,
    updateRecord,
    periods,
    setPeriods,
    exceptionData,
    setExceptionType,
    updateRecords,
  };
}
