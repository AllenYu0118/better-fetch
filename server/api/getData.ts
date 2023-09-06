export default defineEventHandler(async (event) => {
  return {
    status: 1,
    msg: 'ok',
    data: [
      { id: 1, txt: 'afetch' },
      { id: 2, txt: 'bfetch' },
    ],
  };
});
