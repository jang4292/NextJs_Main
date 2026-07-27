"use client";

import React from "react";
import {
  formatNumber,
  TAX_INCREMENT_OPTIONS,
} from "@/features/tax-calculator/application/use-cases/taxCalculatorViewModel";
import { useTaxCalculatorViewModel } from "@/features/tax-calculator/presentation/hooks/useTaxCalculatorViewModel";

export function TaxCalculator() {
  const vm = useTaxCalculatorViewModel();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    vm.submit();
  };

  return (
    <div className="font-sans">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-md"
        noValidate
      >
        <div>
          <label htmlFor="salary" className="mb-2 block font-medium">
            월급 또는 연봉 입력 (원)
          </label>
          <input
            id="salary"
            type="text"
            inputMode="numeric"
            pattern="[0-9,]*"
            value={formatNumber(vm.salary)}
            onChange={(e) => vm.updateSalary(e.target.value)}
            placeholder="4,000,000"
            className={`w-full rounded border p-3 ${
              vm.error ? "border-red-500" : "border-gray-300"
            } rounded border p-2 text-right focus:ring-2 focus:ring-blue-500 focus:outline-none`}
            aria-describedby="salary-error"
            aria-invalid={!!vm.error}
          />

          <div className="mt-2 flex justify-between">
            {TAX_INCREMENT_OPTIONS.map((inc) => (
              <button
                key={`inc-${inc}`}
                type="button"
                onClick={() => vm.adjustSalary(inc)}
                className="mx-0.5 w-1/3 rounded bg-blue-600 py-1 text-white hover:bg-blue-700 focus:outline-none"
                aria-label={`${formatNumber(inc)} 원 증가`}
              >
                +{formatNumber(inc)}
              </button>
            ))}
          </div>

          <div className="mt-1 flex justify-between">
            {TAX_INCREMENT_OPTIONS.map((dec) => (
              <button
                key={`dec-${dec}`}
                type="button"
                onClick={() => vm.adjustSalary(-dec)}
                className="mx-0.5 w-1/3 rounded bg-gray-300 py-1 text-gray-700 hover:bg-gray-400 focus:outline-none"
                aria-label={`${formatNumber(dec)} 원 감소`}
              >
                -{formatNumber(dec)}
              </button>
            ))}
          </div>

          {vm.error && (
            <p
              id="salary-error"
              role="alert"
              className="mt-2 text-sm font-medium text-red-600"
            >
              {vm.error}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="monthly"
            type="checkbox"
            checked={vm.monthly}
            onChange={(e) => vm.setMonthly(e.target.checked)}
            className="h-5 w-5"
          />
          <label htmlFor="monthly" className="select-none">
            월급 기준으로 계산
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="insurance"
            type="checkbox"
            checked={vm.includeInsurance}
            onChange={(e) => vm.setIncludeInsurance(e.target.checked)}
            className="h-5 w-5"
          />
          <label htmlFor="insurance" className="select-none">
            4대보험 포함
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 py-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          계산하기
        </button>
      </form>

      {vm.result && (
        <section
          aria-live="polite"
          className="mt-6 space-y-2 rounded-lg bg-gray-100 p-6"
        >
          <h2 className="mb-3 text-xl font-semibold">계산 결과</h2>
          <ul className="list-inside list-disc space-y-1 text-gray-800">
            <li>소득세: {formatNumber(vm.result.incomeTax)} 원</li>
            <li>지방소득세: {formatNumber(vm.result.localIncomeTax)} 원</li>
            <li>국민연금: {formatNumber(vm.result.nationalPension)} 원</li>
            <li>건강보험: {formatNumber(vm.result.healthInsurance)} 원</li>
            <li>고용보험: {formatNumber(vm.result.employmentInsurance)} 원</li>
            <li className="font-semibold">
              총 공제액: {formatNumber(vm.result.totalDeductions)} 원
            </li>
            <li className="font-semibold">
              실수령 연봉: {formatNumber(vm.result.netSalary)} 원
            </li>
            <li className="font-semibold">
              실수령 월급: {formatNumber((vm.result.netSalary / 12).toFixed(0))}{" "}
              원
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
