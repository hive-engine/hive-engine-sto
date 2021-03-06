import { Step4Model } from '../routes/account/routes/accredited-investor/step-4/step-4.model';
import { Step3Model } from '../routes/account/routes/accredited-investor/step-3/step-3.model';
import { Step2Model } from '../routes/account/routes/accredited-investor/step-2/step-2.model';
import { Step1Model } from '../routes/account/routes/accredited-investor/step-1/step-1.model';

export enum AirDropMode {
    'issue' = 'issue',
    'transfer' = 'transfer'
};
export interface State {
  user: {
      name: string;
      accessToken: string;
      refreshToken: string;
      balances: any[];
      buyBook: any[];
      sellBook: any[];
      tokenBalance: any[];
      totalUsdValue: number;
      loggedIn: boolean;
  };
  
  loading: boolean;

  investorQuestionnaire: {
      currentStep: number;
      totalSteps: number;
      step1: Step1Model;
      step2: Step2Model;
      step3: Step3Model;
      step4: Step4Model;
  }
}

export const initialState: State = {
  user: {
      name: '',
      accessToken: '',
      refreshToken: '',
      balances: [],
      buyBook: [],
      sellBook: [],
      tokenBalance: [],
      totalUsdValue: 0.00,
      loggedIn: false
  },
  loading: false,
  investorQuestionnaire: {
      currentStep: 1,
      totalSteps: 1,
      step1: new Step1Model(),
      step2: new Step2Model(),
      step3: new Step3Model(),
      step4: new Step4Model()
  }
};
