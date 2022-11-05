import random

#from functools import lru_cache
#from itertools import accumulate
from sage.crypto.sbox import SBox

def get_random_candidate(size):
    candidate = []
    for i in range(int(2**size)):
        candidate.append(i)
    random.shuffle(candidate)
    return tuple(candidate)


def mutate(candidate):
    new_candidate = []
    i = random.randrange(len(candidate))
    j = random.randrange(len(candidate))
    while (j == i):
        j = random.randrange(len(candidate))
    for k in range(len(candidate)):
        if k == i:
            new_candidate.append(candidate[j])
        elif k == j:
            new_candidate.append(candidate[i])
        else:
            new_candidate.append(candidate[k])
    return tuple(new_candidate)


def crossover(candidate1, candidate2):
    # this is crossover function
    new_candidate = []
    sbox1 = SBox(candidate1)
    sbox2 = SBox(candidate2)
    for i in range(len(candidate1)):
        new_candidate.append(sbox1(sbox2(i)))
    return tuple(new_candidate)

    return tuple(new_candidate)


#@lru_cache(maxsize = int(1024))  # TODO: Ensure the maxsize is set to something at least the same size as the population
def evaluate_candidate(candidate):

    sbox = SBox(candidate)
    NL = sbox.nonlinearity()
    LBA = sbox.differential_branch_number()
    MLP = sbox.maximal_difference_probability_absolute()
    MLB = sbox.maximal_linear_bias_relative()
    BU = sbox.boomerang_uniformity()
    total = (NL + LBA * 52.1 + MLP * 53.8 + BU * 19) / 111
    
    return total

    # in here total is actual evaluated value of each cadidate

    #return random.random()  # TODO: Make this actually use the above values (and any others we include later)


def evaluate(population):
    result = []
    for candidate in population:
        score = evaluate_candidate(candidate)
        global Max_sol
        if Max_sol < score:
            Max_sol = score + 1
        result.append(score)
    return result


def sort_population(population):
    # reverse means array reverse
    # in other words, sort in decreasing order. so value of population[0] is the biggest.
    return sorted(population, key = evaluate_candidate, reverse = True)  # TODO: reverse may need to be false to ensure the best candidates are first in the list


def evolve_new_population(population):
    # evaluated values of each candidate and in other words it is called fitness value
    # this used in choice candidates by their dominant so more fitness candidates are alive
    # and rest is died.
    scores = evaluate(population)
   
    new_population = []
   
    # Add some of the best candidates?
    new_population.append(population[0])
   
    # Add some of the worst candidates?
    new_population.append(population[-1])
   
    # Add some random candidates?
    new_population.append(get_random_candidate(SBOX_SIZE))
   
    # Evolve new candidates
    while len(new_population) < len(population):
        # if sagemath doesn't support random.choices, then can use following orders
        # pair = []
        # a = random.randrange(len(population))
        # pair.append(population[a])
        # a = random.randrange(len(population))
        # pair.append(population[a])

        # choice 2 candidates by their score
        pair = random.choices(population, scores, k=2)

        candidate = crossover(pair[0], pair[1])
        if random.random() < MUTATION_RATE:
            candidate = mutate(candidate)
        new_population.append(candidate)
   
    return sort_population(new_population)


POPULATION_SIZE = 100
MAX_GENERATIONS = 100
SBOX_SIZE = 4
MUTATION_RATE = 0.1

Max_sol = 0

# Initialise population
population = sort_population([get_random_candidate(SBOX_SIZE) for i in range(POPULATION_SIZE)])


# Evolve population
for i in range(MAX_GENERATIONS):
    population = evolve_new_population(population)


best = population[0]
worst = population[-1]
print(best, evaluate_candidate(best) / Max_sol)
print(worst, evaluate_candidate(worst) / Max_sol)