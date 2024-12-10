"use client";

import TechRequirementsGatherer from "@/components/website/TechRequirementsGatherer";
import { DashboardClientProps } from "../profile/DashboardClient";


export default function GetStartedClient({ initialUser }:DashboardClientProps) {
  return (
    <div className="">

    <TechRequirementsGatherer />

     
    </div>
  );
}
