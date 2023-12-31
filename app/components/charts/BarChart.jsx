"use client";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
// import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import axios from "axios";


const BarChart = ({chartData,chartOptions}) => {
  return (
    <div className="chart-container">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default BarChart;
