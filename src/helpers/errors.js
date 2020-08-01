const statusErrors = {
  DEFAULT: 'Erro desconhecido, tente novamente.',
  INVALID_ARGUMENT: 'Requisição possui argumentos inválidos, revise e tente novamente.',
  PERMISSION_DENIED: 'Você não tem permissão para leitura dos dados na conta informada. Tenha certeza de que selecionou a conta correta e tente novamente.',
  UNAUTHENTICATED: 'Acesso não autorizado. Tente novamente.',
}

module.exports = {
  handleGoogleErrors: errorStatus => statusErrors[errorStatus] || statusErrors.DEFAULT,
};