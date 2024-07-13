import { FxLens } from "../abi/types";
import { getContract } from "../utils/blockchain";
import LENS_ABI from "../abi/1fx-lens.json";
import { BigNumber } from "ethers";

const contractFactoryAddress = "0x648cE75895873BECBC4c9a291A28CA1EF121953B";
const contractLensAddress = "0xAe3C2d45270791Ef8aD023D1E66d275255db0499";
const contractAavePoolAddress = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";

export const getLensContract = getContract<FxLens>(
  LENS_ABI,
  contractLensAddress,
  137
);

export interface SlotData {
  slot: string;
  owner: string;
  collateral: string;
  collateralDecimals: number;
  debt: string;
  debtDecimals: number;
  totalCollateralBase: BigNumber;
  totalDebtBase: BigNumber;
  availableBorrowsBase: BigNumber;
  currentLiquidationThreshold: BigNumber;
  ltv: BigNumber;
  healthFactor: BigNumber;
}

const testUser = "0x448CC254819520BF086BCf01245982fAB75c3F66";
// const testUserPosAddress = '0x881d2196099597Acc1B9429b4Bb988ebE57a5368'

export const getUserSlots = async (user: string): Promise<SlotData[]> => {
  return await getLensContract.getUserSlots(
    user,
    contractFactoryAddress,
    contractAavePoolAddress
  );
};
