
export type PactFile = PactV2.PactFile | PactV3.PactFile | PactV4.PactFile
export type MockedInteractionV2<TResponse = any> = Omit<PactV2.Interaction<TResponse> , 'request'>
export type MockedInteractionV3<TResponse = any> = Omit<PactV3.Interaction<TResponse> , 'request'>
export type MockedInteractionV4<TResponse = any> = Omit<PactV4.Interaction<TResponse> , 'request'>

