function getUserAvatarUrl(hash, id) {
  return `https://cdn.discordapp.com/avatars/${id}/${hash}.png`;
}

module.exports = { getUserAvatarUrl };
