export default (error: { stack: string }, message: string | undefined) => {
  const newError: any | Error = new Error(message);
  newError.original = error;
  newError.stack =
    newError.stack.split("\n").slice(0, 2).join("\n") + "\n" + error.stack;
  return newError;
};
