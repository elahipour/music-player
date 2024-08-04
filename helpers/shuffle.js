const shuffle = (musics, musicCategory) => {
  let selectedCategory = musics.filter(
    (music) => music.category == musicCategory
  );
  const shuffled=[];
  let currentIndex = selectedCategory.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [selectedCategory[currentIndex], selectedCategory[randomIndex]] = [
      selectedCategory[randomIndex],
      selectedCategory[currentIndex],
    ];
    
  }
  return selectedCategory;
};

export default shuffle;
