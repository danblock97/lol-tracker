// src/app/hooks/league/useProfileData.js
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

const useProfileData = () => {
	const [profileData, setProfileData] = useState(null);
	const [accountData, setAccountData] = useState(null);
	const [rankedData, setRankedData] = useState(null);
	const [championMasteryData, setChampionMasteryData] = useState(null);
	const [matchData, setMatchesData] = useState(null);
	const [matchDetails, setMatchDetails] = useState(null);
	const [liveGameData, setLiveGameData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const searchParams = useSearchParams();
	const gameName = searchParams.get("gameName");
	const tagLine = searchParams.get("tagLine");

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`/api/league/profile?gameName=${gameName}&tagLine=${tagLine}`
			);
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			setProfileData(data.profileData);
			setAccountData(data.accountData);
			setRankedData(data.rankedData);
			setChampionMasteryData(data.championMasteryData);
			setMatchesData(data.matchData);
			setMatchDetails(data.matchDetails);
			setLiveGameData(data.liveGameData);
			setError(null);
		} catch (error) {
			setError(error.message || "Failed to fetch data");
		} finally {
			setIsLoading(false);
		}
	}, [gameName, tagLine]);

	const fetchLiveGameData = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/league/profile?gameName=${gameName}&tagLine=${tagLine}`
			);
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			setLiveGameData(data.liveGameData);
		} catch (error) {
			console.error("Failed to fetch live game data", error);
		}
	}, [gameName, tagLine]);

	useEffect(() => {
		if (gameName && tagLine) {
			fetchData();
		}
	}, [fetchData, gameName, tagLine]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (gameName && tagLine) {
				fetchLiveGameData();
			}
		}, 20000); // Check every 20 seconds

		return () => clearInterval(interval);
	}, [fetchLiveGameData, gameName, tagLine]);

	return {
		profileData,
		accountData,
		rankedData,
		championMasteryData,
		matchData,
		matchDetails,
		liveGameData,
		isLoading,
		error,
		fetchLiveGameData,
	};
};

export default useProfileData;
