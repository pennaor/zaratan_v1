function resolveTerrainStatus(quitado: number): string {
  if (quitado === 1) {
    return 'Fechado';
  }
  if (quitado === 0) {
    return 'Aberto';
  }
  return 'Indeterminado';
}

export default resolveTerrainStatus;
