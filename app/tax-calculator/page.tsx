"use client";

import React, { useState } from "react";
import { calculateTax, TaxResult } from "../lib/taxCalculator";

// 숫자에 쉼표 찍는 함수
const formatNumber = (num: number | string): string => {
  if (num === "" || num === null || isNaN(Number(num))) return "";
  return Number(num).toLocaleString("ko-KR");
};

// 입력값에서 숫자만 추출하는 함수
const extractNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

export default function TaxPage() {
  const [salary, setSalary] = useState<string>("");
  const [monthly, setMonthly] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState<string>("");

  // 단위별 증감 버튼 값
  const increments = [10000, 100000, 1000000];

  // 입력값 변경 핸들러: 숫자만 추출 후 상태 저장
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = extractNumbers(e.target.value);
    setSalary(cleaned);
    setError("");
  };

  // 단위별 증감 버튼 처리
  const handleIncrement = (value: number) => {
    const currentVal = Number(salary) || 0;
    const newVal = currentVal + value;
    if (newVal < 0) {
      setError("금액은 0원 미만이 될 수 없습니다.");
      return;
    }
    setSalary(newVal.toString());
    setError("");
  };

  const handleDecrement = (value: number) => {
    handleIncrement(-value);
  };

  // 계산 버튼 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!salary) {
      setError("금액을 입력하세요.");
      return;
    }

    const grossSalary = Number(salary);

    if (isNaN(grossSalary) || grossSalary <= 0) {
      setError("유효한 금액을 입력하세요.");
      return;
    }

    try {
      const calcResult = calculateTax({
        grossSalary,
        monthly,
        includeInsurance,
      });
      setResult(calcResult);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      console.error(err); // 실제 오류 로그 출력
      setError("계산 중 오류가 발생했습니다. ");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mt-8 mb-4 text-center">
        2025 세금 계산기
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        noValidate
      >
        <div>
          <label htmlFor="salary" className="block mb-2 font-medium">
            월급 또는 연봉 입력 (원)
          </label>
          <input
            id="salary"
            type="text"
            inputMode="numeric"
            pattern="[0-9,]*"
            value={formatNumber(salary)}
            onChange={handleSalaryChange}
            placeholder="4,000,000"
            className={`w-full p-3 border rounded ${
              error ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 text-right p-2 border rounded`}
            aria-describedby="salary-error"
            aria-invalid={!!error}
          />

          {/* 단위별 증감 버튼 - 증가 */}
          <div className="flex justify-between mt-2">
            {increments.map((inc) => (
              <button
                key={`inc-${inc}`}
                type="button"
                onClick={() => handleIncrement(inc)}
                className="w-1/3 mx-0.5 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
                aria-label={`${formatNumber(inc)} 원 증가`}
              >
                +{formatNumber(inc)}
              </button>
            ))}
          </div>

          {/* 단위별 증감 버튼 - 감소 */}
          <div className="flex justify-between mt-1">
            {increments.map((dec) => (
              <button
                key={`dec-${dec}`}
                type="button"
                onClick={() => handleDecrement(dec)}
                className="w-1/3 mx-0.5 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                aria-label={`${formatNumber(dec)} 원 감소`}
              >
                -{formatNumber(dec)}
              </button>
            ))}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p
              id="salary-error"
              role="alert"
              className="mt-2 text-sm text-red-600 font-medium"
            >
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="monthly"
            type="checkbox"
            checked={monthly}
            onChange={(e) => setMonthly(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="monthly" className="select-none">
            월급 기준으로 계산
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="insurance"
            type="checkbox"
            checked={includeInsurance}
            onChange={(e) => setIncludeInsurance(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="insurance" className="select-none">
            4대보험 포함
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          계산하기
        </button>
      </form>

      {result && (
        <section
          aria-live="polite"
          className="mt-6 bg-gray-100 p-6 rounded-lg space-y-2"
        >
          <h2 className="text-xl font-semibold mb-3">계산 결과</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            <li>소득세: {formatNumber(result.incomeTax)} 원</li>
            <li>지방소득세: {formatNumber(result.localIncomeTax)} 원</li>
            <li>국민연금: {formatNumber(result.nationalPension)} 원</li>
            <li>건강보험: {formatNumber(result.healthInsurance)} 원</li>
            <li>고용보험: {formatNumber(result.employmentInsurance)} 원</li>
            <li className="font-semibold">
              총 공제액: {formatNumber(result.totalDeductions)} 원
            </li>
            <li className="font-semibold">
              실수령 연봉: {formatNumber(result.netSalary)} 원
            </li>
            <li className="font-semibold">
              실수령 월급: {formatNumber((result.netSalary / 12).toFixed(0))} 원
            </li>
          </ul>
        </section>
      )}
    </main>
  );
}
