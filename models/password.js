import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNunbermOfRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNunbermOfRounds() {
  let rounds = 1;

  if (process.env.NODE_ENV === "production") {
    rounds = 14;
  }

  return rounds;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
