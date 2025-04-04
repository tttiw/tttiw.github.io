# Truth Table

This code template generates a truth table for a given logical expression.

Ported from "tt.c" by Mitchell Xu - https://github.com/zeyi2/tt.c

## License

Both this version and the original are licensed under the MIT License.

## Code

```python

"""
MIT License

Copyright (c) 2025 tttiw
Copyright (c) 2025 Mitchell Xu <mitchell@sdf.org>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

from wCalc import input, get_current_lang

OP_AND = '&'
OP_OR = '|'
OP_NOT = '~'
OP_XOR = '^'
OP_IMPLY = '>'
OP_EQUAL = '='
OP_LPAR = '('
OP_RPAR = ')'
OP_END = '\0'
OP_VAR = 'VAR'

class Token:
    def __init__(self, op, var=None):
        self.op = op
        self.var = var

    def __repr__(self):
        if self.op == OP_VAR:
            return f"Token({self.op}, {self.var})"
        return f"Token({self.op})"

class ASTNode:
    def __init__(self, token, left=None, right=None):
        self.token = token
        self.left = left
        self.right = right

def mknode(op, left, right, name=None):
    return ASTNode(Token(op, name), left, right)


def mkleaf(op, name):
    return mknode(op, None, None, name)


def mkunary(op, left, name=None):
    return mknode(op, left, None, name)

def tokenize(s):
    tokens = []
    for ch in s:
        if ch.isspace():
            continue
        elif ch == '&':
            tokens.append(Token(OP_AND))
        elif ch == '|':
            tokens.append(Token(OP_OR))
        elif ch == '^':
            tokens.append(Token(OP_XOR))
        elif ch == '~':
            tokens.append(Token(OP_NOT))
        elif ch == '(':
            tokens.append(Token(OP_LPAR))
        elif ch == ')':
            tokens.append(Token(OP_RPAR))
        elif ch == '>':
            tokens.append(Token(OP_IMPLY))
        elif ch == '=':
            tokens.append(Token(OP_EQUAL))
        elif ch.isalpha():
            tokens.append(Token(OP_VAR, ch))
        else:
            raise RuntimeError(f"Illegal character: {ch}")
    tokens.append(Token(OP_END))
    return tokens

def prec(op):
    if op == OP_NOT:
        return 6
    elif op == OP_AND:
        return 5
    elif op == OP_XOR:
        return 4
    elif op == OP_OR:
        return 3
    elif op == OP_IMPLY:
        return 2
    elif op == OP_EQUAL:
        return 1
    elif op == OP_LPAR:
        return -1
    else:
        return -1

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def current_token(self):
        return self.tokens[self.pos]

    def consume(self):
        self.pos += 1

    def parse(self):
        t = self.current_token()
        if t.op == OP_VAR:
            self.consume()
            return mkleaf(t.op, t.var)
        elif t.op == OP_NOT:
            self.consume()
            return mkunary(t.op, self.parse())
        elif t.op == OP_LPAR:
            self.consume()
            expr = self.parexp(0)
            if self.current_token().op != OP_RPAR:
                raise RuntimeError(f"Mismatched Parentheses at position {self.pos}")
            self.consume()
            return expr
        else:
            raise RuntimeError("Expect an expression")

    def parexp(self, m_prec):
        left = self.parse()
        while True:
            t = self.current_token()
            pre = prec(t.op)
            if pre < m_prec:
                break
            op = t.op
            self.consume()
            right = self.parexp(pre + 1)
            left = mknode(op, left, right)
        return left

def collect(node, var_list):
    if node is None:
        return
    if node.left is None and node.right is None:
        if node.token.var not in var_list:
            var_list.append(node.token.var)
    collect(node.left, var_list)
    collect(node.right, var_list)

def evaluate(node, values, var_list):
    if node.left is None and node.right is None:
        return values[node.token.var]

    left_val = evaluate(node.left, values, var_list) if node.left else 0
    right_val = evaluate(node.right, values, var_list) if node.right else 0

    op = node.token.op
    if op == OP_AND:
        return int(bool(left_val) and bool(right_val))
    elif op == OP_OR:
        return int(bool(left_val) or bool(right_val))
    elif op == OP_NOT:
        return int(not bool(left_val))
    elif op == OP_XOR:
        return int(bool(left_val) ^ bool(right_val))
    elif op == OP_IMPLY:
        return int((not bool(left_val)) or bool(right_val))
    elif op == OP_EQUAL:
        return int(bool(left_val) == bool(right_val))
    else:
        return -1

def print_table(expr_str, expr, var_list):
    print(f"R = {expr_str}")
    header = "".join(f"| {var} " for var in var_list) + "| R |"
    print(header)
    n = len(var_list)
    for i in range(1 << n):
        row = ""
        assignment = {}
        for j, var in enumerate(var_list):
            value = (i >> (n - 1 - j)) & 1
            assignment[var] = value
            row += f"| {value} "
        result = evaluate(expr, assignment, var_list)
        row += f"| {result} |"
        print(row)

def print_ast(node, depth=0, is_left=False):
    if node is None:
        return
    print_ast(node.right, depth + 1, False)

    prefix = ""
    for i in range(depth - 1):
        prefix += "│   "
    if depth > 0:
        prefix += "└---" if is_left else "├---"

    op = node.token.op
    if op == OP_VAR:
        print(prefix + f"VAR('{node.token.var}')")
    elif op == OP_AND:
        print(prefix + "AND(&)")
    elif op == OP_OR:
        print(prefix + "OR(|)")
    elif op == OP_XOR:
        print(prefix + "XOR(^)")
    elif op == OP_NOT:
        print(prefix + "NOT(~)")
    elif op == OP_IMPLY:
        print(prefix + "IMPLY(>)")
    elif op == OP_EQUAL:
        print(prefix + "EQUAL(=)")
    else:
        print(prefix + "UNKNOWN")

    print_ast(node.left, depth + 1, True)

if(get_current_lang() == "zh"):
    prompt = "输入表达式（如 A&B|C^B）："
else:
    prompt = "Enter expression (eg. A&B|C^B):"
    
expr_str = await input(prompt)
tokens = tokenize(expr_str)
parser = Parser(tokens)
expr = parser.parexp(0)
var_list = []
collect(expr, var_list)
print_table(expr_str, expr, var_list)
print("\n")
print_ast(expr, 0, False)
print("\n")
```