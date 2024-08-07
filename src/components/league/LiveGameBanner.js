import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LiveGameBanner = ({ liveGameData, gameName, tagLine }) => {
	const router = useRouter();

	const handleLiveGameClick = () => {
		router.push(`/league/live-game?gameName=${gameName}&tagLine=${tagLine}`);
	};

	const participant = liveGameData?.participants?.find(
		(p) => p.gameName === gameName && p.tagLine === tagLine
	);

	if (!participant) {
		return null;
	}

	const team100 = liveGameData.participants.filter((p) => p.teamId === 100);
	const team200 = liveGameData.participants.filter((p) => p.teamId === 200);

	return (
		<div
			className="bg-[#13151b] text-white p-4 rounded-md mb-4 cursor-pointer flex flex-col w-full hover:bg-[#1c1e24] transition-all duration-200"
			onClick={handleLiveGameClick}
			role="button"
			aria-label={`Live game in progress: ${gameName}#${tagLine}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Image
						src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant.championId}.png`}
						alt={`${participant.championId} Icon`}
						width={48}
						height={48}
						className="rounded-full"
					/>
					<div>
						<p className="font-bold">Live Game In Progress!</p>
						<p className="text-sm text-gray-300">
							{gameName}#{tagLine} is playing now! Click here for details!
						</p>
					</div>
				</div>
				<div className="flex flex-col space-y-1">
					<div className="flex space-x-2">
						{team100.map((p, index) => (
							<Image
								key={index}
								src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p.championId}.png`}
								alt={`${p.championId} Icon`}
								width={24}
								height={24}
								className="rounded-full border-2 border-blue-500"
							/>
						))}
					</div>
					<div className="flex space-x-2 mt-1">
						{team200.map((p, index) => (
							<Image
								key={index}
								src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${p.championId}.png`}
								alt={`${p.championId} Icon`}
								width={24}
								height={24}
								className="rounded-full border-2 border-red-500"
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LiveGameBanner;
