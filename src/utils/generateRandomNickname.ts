import NicknameData from './nicknameData.json';

export function getRandomNickname() {
  return (
    NicknameData.stacks[
      Math.floor(Math.random() * NicknameData.stacks.length)
    ] +
    ' ' +
    NicknameData.names[Math.floor(Math.random() * NicknameData.names.length)]
  );
}
export const nicknameUtils = {
  getRandomNickname,
};
export default nicknameUtils;
