const KEY = "cyberkavach_users";

export const getUsers = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const saveUsers = (users) => {
  localStorage.setItem(KEY, JSON.stringify(users));
};

export const triggerUpdate = () => {
  window.dispatchEvent(new Event("storageUpdate"));
};

export const assignPoints = (name, points, category, remarks) => {
  let users = getUsers();

  const cleanName = name.trim().toLowerCase();
  const pointValue = Number(points);

  const entry = {
    category,
    points: pointValue,
    remarks,
    date: new Date().toLocaleString(),
  };

  let index = users.findIndex(
    (u) => u.name.toLowerCase() === cleanName
  );

  if (index === -1) {
    users.push({
      name: name.trim(),
      points: pointValue,
      history: [entry],
    });
  } else {
    users[index].points += pointValue;
    users[index].history = [
      ...(users[index].history || []),
      entry,
    ];
  }

  saveUsers(users);
  triggerUpdate();
};

export const getLeaderboard = () => {
  let users = getUsers();

  return users
    .map((u) => {
      const points = Number(u.points || 0);

      let badge = "Bronze";
      if (points >= 300) badge = "Gold";
      else if (points >= 150) badge = "Silver";

      return { ...u, points, badge };
    })
    .sort((a, b) => b.points - a.points);
};