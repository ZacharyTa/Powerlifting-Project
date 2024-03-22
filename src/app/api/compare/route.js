import { NextResponse } from "next/server";
import getAgeDivID from "@/utils/getAgeDivID";
import getWeightDivID from "@/utils/getWeightDivID";
import getPercentStronger from "@/data/compare/strongerPercents";
import getPercentiles from "@/data/compare/percentiles";

export async function GET(req) {
  const res = NextResponse;
  try {
    const age = req.nextUrl.searchParams.get("age");
    const unit = req.nextUrl.searchParams.get("unit");
    let sex = req.nextUrl.searchParams.get("sex");
    let weight = req.nextUrl.searchParams.get("weight");
    let bench = req.nextUrl.searchParams.get("bench");
    let squat = req.nextUrl.searchParams.get("squat");
    let deadlift = req.nextUrl.searchParams.get("deadlift");

    // Binary Encodes sex for SQL query
    sex = sex === "female" ? "1" : "0";

    // Unit conversion if necessary
    const lbsToKg = (weight) => Math.round((weight / 2.20462) * 100) / 100;
    if (unit === "lbs")
      [weight, bench, squat, deadlift] = [
        lbsToKg(weight),
        lbsToKg(bench),
        lbsToKg(squat),
        lbsToKg(deadlift),
      ];

    const total = parseInt(bench) + parseInt(squat) + parseInt(deadlift);

    // Get the age_div_id and weight_div_id
    const ageDivID = await getAgeDivID(age);
    const weightDivID = await getWeightDivID(sex, weight, age);

    // Calculate the percentage of lifters stronger than the user within the same age and weight division
    const results = await getPercentStronger(
      total,
      bench,
      squat,
      deadlift,
      ageDivID,
      weightDivID,
    );

    // Get the percentile averages within the same age and weight division
    const percentileResults = await getPercentiles(ageDivID, weightDivID);

    // lift Values Unit conversion if necessary
    if (unit === "lbs")
      for (const key in percentileResults) {
        if (percentileResults[key].length > 0) {
          percentileResults[key].forEach((element) => {
            element.lift_value = Math.round(element.lift_value * 2.20462);
          });
        }
      }

    return res.json(
      { message: "OK", items: results, percentiles: percentileResults },
      { status: 200 },
    );
  } catch (error) {
    return res.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
}
