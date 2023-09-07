export default defineEventHandler(async (event) => {
  return {
    status: 1,
    msg: 'ok',
    data: 'timeout',
  };
});
