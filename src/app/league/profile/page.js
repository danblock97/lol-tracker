"use client";

import React, { useState, useEffect, useCallback } from "react";
import Profile from "@/components/league/Profile";
import RankedInfo from "@/components/league/RankedInfo";
import ChampionMastery from "@/components/league/ChampionMastery";
import MatchHistory from "@/components/league/MatchHistory";
import LiveGameBanner from "@/components/league/LiveGameBanner";
import Loading from "@/components/Loading";

const ProfilePage = ({ searchParams }) => {
	const { gameName, tagLine } = searchParams;
	const [profileData, setProfileData] = useState(null);
	const [accountData, setAccountData] = useState(null);
	const [rankedData, setRankedData] = useState(null);
	const [championMasteryData, setChampionMasteryData] = useState(null);
	const [matchDetails, setMatchDetails] = useState(null);
	const [liveGameData, setLiveGameData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isUpdating, setIsUpdating] = useState(false);

	const fetchProfileData = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/league/profile?gameName=${gameName}&tagLine=${tagLine}`
			);
			if (!response.ok) {
				throw new Error("Failed to fetch profile");
			}
			const data = await response.json();
			setProfileData(data.profiledata);
			setAccountData(data.accountdata);
			setRankedData(data.rankeddata);
			setChampionMasteryData(data.championmasterydata);
			setMatchDetails(data.matchdetails);
			setLiveGameData(data.livegamedata);
		} catch (error) {
			setError(error.message);
		} finally {
			setIsLoading(false);
		}
	}, [gameName, tagLine]);

	useEffect(() => {
		fetchProfileData();
	}, [fetchProfileData]);

	const triggerUpdate = async () => {
		setIsUpdating(true);
		try {
			const response = await fetch("/api/league/profile", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": process.env.NEXT_PUBLIC_UPDATE_API_KEY,
				},
				body: JSON.stringify({ gameName, tagLine }),
			});
			const result = await response.json();
			await fetchProfileData(); // Fetch new data after update
		} catch (error) {
			console.error("Error triggering update:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return (
			<div className="bg-[#0e1015]">
				<Loading />
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-screen min-h-screen bg-[#0e1015] items-center p-4">
				<p className="text-red-500 text-center">{error}</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#0e1015] flex flex-col items-center p-4">
			<div className="max-w-screen-xl flex flex-col sm:flex-row w-full">
				{/* Left Section - Profile, Ranked, Champion */}
				<div className="w-full md:w-1/3 sm:pr-4 flex flex-col gap-4">
					{profileData && accountData ? (
						<>
							<Profile accountData={accountData} profileData={profileData} />
						</>
					) : (
						<p className="text-white">No profile data found.</p>
					)}
					{rankedData && <RankedInfo rankedData={rankedData} />}
					{championMasteryData && (
						<ChampionMastery championMasteryData={championMasteryData} />
					)}
				</div>
				{/* Right Section - Match History and Live Game Banner */}
				<div className="w-full md:w-2/3 sm:pl-4 flex flex-col gap-4">
					{liveGameData && (
						<LiveGameBanner
							liveGameData={liveGameData}
							gameName={accountData?.gameName}
							tagLine={accountData?.tagLine}
						/>
					)}
					{matchDetails && (
						<MatchHistory
							matchDetails={matchDetails}
							selectedSummonerPUUID={profileData ? profileData.puuid : null}
							gameName={accountData?.gameName}
							tagLine={accountData?.tagLine}
						/>
					)}
				</div>
			</div>
			<div className="fixed top-28 right-4">
				<button
					onClick={triggerUpdate}
					className={`px-4 py-2 bg-[#13151b] text-white rounded ${
						isUpdating ? "opacity-50 cursor-not-allowed" : ""
					}`}
					disabled={isUpdating}
				>
					{isUpdating ? "Updating..." : "Update Profile"}
				</button>
			</div>
			{isLoading && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<p className="text-white">Loading...</p>
				</div>
			)}
			{error && (
				<div className="h-screen min-h-screen bg-[#0e1015] items-center p-4">
					<p className="text-red-500 text-center">{error}</p>
				</div>
			)}
		</div>
	);
};

export default ProfilePage;
