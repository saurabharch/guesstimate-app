import Guesstimates from '../models/guesstimates.js'

let initialGuesstimates = [
  {
    metric: '238jdj',
    input: '10000000/1000000',
    distribution: {
      mean: 10000000,
      stdev: 4
    },
  },
  {
    metric: '8sdjf8sjddf',
    input: '20/20',
    distribution: {
      mean: 0.03,
      stdev: 20
    },
  },
  {
    metric: '238iojic',
    input: '10000/2000',
    distribution: {
      mean: 8232838238.238832,
      stdev: 4
    },
  },
  {
    metric: '238iojib',
    input: '=TPY*3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  },
  {
    metric: '238iojia',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  },
  {
    metric: '238iojid',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  },
  {
    metric: '238ioji3',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  }
];

export default function guesstimates(state = initialGuesstimates, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Guesstimates(state)).create(action.id).state;
  case 'REMOVE_METRIC':
    return (new Guesstimates(state)).remove(action.id).state;
  case 'CHANGE_GUESSTIMATE':
    return (new Guesstimates(state)).change(action.id, action.values).state;
  default:
    return state;
  }
}
