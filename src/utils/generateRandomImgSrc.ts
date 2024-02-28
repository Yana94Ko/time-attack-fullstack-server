const randomImgSrc = [
  'https://img2.joongna.com/media/original/2024/02/22/1708584514352Idn_QRbze.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/02/28/1709082036740a2k_g6J7P.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/02/28/1709082164717xcv_H42rq.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/cafe-article-data/live/2024/02/27/1042750402/1709040465861_000_FilNi_main.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/02/17/1708140074407OJO_oZtYd.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/02/28/1709083234376HMv_c9zS4.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/01/27/1706317473191mDV_h93dw.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/01/27/1706310824337Qyr_AWM7g.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/02/28/17090821375859zc_ypKkK.jpg?impolicy=thumb&size=150',
  'https://img2.joongna.com/media/original/2024/02/09/1707447026472bJU_Akloe.jpg?impolicy=thumb&size=150',
];
export function generateRandomImgSrc() {
  return randomImgSrc[Math.floor(Math.random() * randomImgSrc.length)];
}
export const nicknameUtils = {
  generateRandomImgSrc,
};
export default nicknameUtils;
