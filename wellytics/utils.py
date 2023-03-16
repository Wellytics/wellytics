from uuid import uuid4


uuid = lambda: str(uuid4())

_map = lambda f, xs: list(map(f, xs))

_find = lambda f, xs: next(filter(f, xs), None)

_find_index = lambda f, xs: next((i for i, x in enumerate(xs) if f(x)), None)

_filter = lambda f, xs: list(filter(f, xs))
