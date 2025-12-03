export function getAnimalPic(species: string | undefined | null): string {
  const key = (species ?? '').trim().toLowerCase();

  switch (key) {
    case 'dog':
      return 'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&w=800';

    case 'cat':
      return 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800';

    case 'fish':
      return 'https://images.pexels.com/photos/161172/goldfish-fish-aquarium-fish-fauna-161172.jpeg?auto=compress&cs=tinysrgb&w=800';

    case 'bird':
      return 'https://images.pexels.com/photos/45853/bird-nature-robin-red-45853.jpeg?auto=compress&cs=tinysrgb&w=800';

    default:
      return 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
}
