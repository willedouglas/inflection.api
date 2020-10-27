const DEFAULT_ERROR = 'Erro desconhecido, tente novamente.';

const GOOGLE_ERROR_STATUS = {
  INVALID_ARGUMENT: 'Requisição possui argumentos inválidos, revise e tente novamente.',
  PERMISSION_DENIED: 'Você não tem permissão para leitura dos dados na conta informada. Tenha certeza de que selecionou a conta correta e tente novamente.',
  UNAUTHENTICATED: 'Você não tem permissão para leitura dos dados na conta informada. Tenha certeza de que selecionou a conta correta e tente novamente.',
};

const FACEBOOK_ERROR_STATUS = {
  100: 'A conta informada não existe, não pode ser carregada devido a permissões ausentes ou não é compatível com esta operação.',
};

module.exports = {
  handleGoogleErrors: (errorStatus) => GOOGLE_ERROR_STATUS[errorStatus] || DEFAULT_ERROR,
  handleFacebookErrors: (errorStatus) => FACEBOOK_ERROR_STATUS[errorStatus] || DEFAULT_ERROR,
};
