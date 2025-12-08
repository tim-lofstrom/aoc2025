#!/usr/bin/env python3

import sys

data = [line.strip() for line in sys.stdin.readlines()]
s = 100
p = 50
p1 = 0
p2 = 0

for d in data:
    n = int(d[1:])
    r = d[0]

    for _ in range(n):
        if r == 'L':
            p = (p - 1) % s
        else:
            p = (p + 1) % s
        if p == 0:
            p2 += 1
    if p == 0:
        p1 += 1

print(f"Part 1: {p1}")
print(f"Part 2: {p2}")