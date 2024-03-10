"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { ATTRIBUTES, SEX, UNIT } from "@/data/calculator/Calculations";
import { useState } from "react";

const Calculator = ({ onCalculate }) => {
  const [data, setData] = useState(ATTRIBUTES);

  const handleSubmit = async () => {
    try {
      data.sex;
      const response = await fetch(
        `/api/comparePercents?age=${data.age}&sex=${data.sex}&unit=${data.unit}&weight=${data.weight}&bench=${data.bench}&squat=${data.squat}&deadlift=${data.deadlift}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP error: status: ${response.status}`);
      }

      // Pass the response data to the onCalculate function
      onCalculate(responseData.compareLifts[0]);
    } catch (error) {
      console.error("A problem occurred when making the API call:", error);
    }
  };

  return (
    <div className="flex flex-col gap-y-7 items-center">
      <div className="flex flex-row gap-x-5">
        <Input name="age" maxLength={3} data={data} setData={setData} />
        <Radio options={SEX} field="sex" current={data} setCurrent={setData} />
      </div>
      <>
        <Radio
          options={UNIT}
          field="unit"
          current={data}
          setCurrent={setData}
        />
        <Input
          name="weight"
          maxLength={3}
          data={data}
          isDecimal={true}
          setData={setData}
        />
        <Input
          name="squat"
          maxLength={4}
          data={data}
          isDecimal={true}
          setData={setData}
        />
        <Input
          name="bench"
          maxLength={4}
          data={data}
          isDecimal={true}
          setData={setData}
        />
        <Input
          name="deadlift"
          maxLength={4}
          data={data}
          isDecimal={true}
          setData={setData}
        />
      </>

      <Button name="Submit" onClick={handleSubmit} />
    </div>
  );
};
export default Calculator;
