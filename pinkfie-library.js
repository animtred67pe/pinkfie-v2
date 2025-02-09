'use strict';
var libtess = (function(){
	var n;
	function t(a, b) {
		return a.b === b.b && a.a === b.a
	}
	function u(a, b) {
		return a.b < b.b || a.b === b.b && a.a <= b.a
	}
	function v(a, b, c) {
		var d = b.b - a.b
		, e = c.b - b.b;
		return 0 < d + e ? d < e ? b.a - a.a + d / (d + e) * (a.a - c.a) : b.a - c.a + e / (d + e) * (c.a - a.a) : 0
	}
	function x(a, b, c) {
		var d = b.b - a.b
		, e = c.b - b.b;
		return 0 < d + e ? (b.a - c.a) * d + (b.a - a.a) * e : 0
	}
	function z(a, b) {
		return a.a < b.a || a.a === b.a && a.b <= b.b
	}
	function aa(a, b, c) {
		var d = b.a - a.a
		, e = c.a - b.a;
		return 0 < d + e ? d < e ? b.b - a.b + d / (d + e) * (a.b - c.b) : b.b - c.b + e / (d + e) * (c.b - a.b) : 0
	}
	function ba(a, b, c) {
		var d = b.a - a.a
		, e = c.a - b.a;
		return 0 < d + e ? (b.b - c.b) * d + (b.b - a.b) * e : 0
	}
	function ca(a) {
		return u(a.b.a, a.a)
	}
	function da(a) {
		return u(a.a, a.b.a)
	}
	function A(a, b, c, d) {
		a = 0 > a ? 0 : a;
		c = 0 > c ? 0 : c;
		return a <= c ? 0 === c ? (b + d) / 2 : b + a / (a + c) * (d - b) : d + c / (a + c) * (b - d)
	}
	;function ea(a) {
		var b = B(a.b);
		C(b, a.c);
		C(b.b, a.c);
		D(b, a.a);
		return b
	}
	function E(a, b) {
		var c = !1
		, d = !1;
		a !== b && (b.a !== a.a && (d = !0,
		F(b.a, a.a)),
		b.d !== a.d && (c = !0,
		G(b.d, a.d)),
		H(b, a),
		d || (C(b, a.a),
		a.a.c = a),
		c || (D(b, a.d),
		a.d.a = a))
	}
	function I(a) {
		var b = a.b
		, c = !1;
		a.d !== a.b.d && (c = !0,
		G(a.d, a.b.d));
		a.c === a ? F(a.a, null) : (a.b.d.a = J(a),
		a.a.c = a.c,
		H(a, J(a)),
		c || D(a, a.d));
		b.c === b ? (F(b.a, null),
		G(b.d, null)) : (a.d.a = J(b),
		b.a.c = b.c,
		H(b, J(b)));
		fa(a)
	}
	function K(a) {
		var b = B(a)
		, c = b.b;
		H(b, a.e);
		b.a = a.b.a;
		C(c, b.a);
		b.d = c.d = a.d;
		b = b.b;
		H(a.b, J(a.b));
		H(a.b, b);
		a.b.a = b.a;
		b.b.a.c = b.b;
		b.b.d = a.b.d;
		b.f = a.f;
		b.b.f = a.b.f;
		return b
	}
	function L(a, b) {
		var c = !1
		, d = B(a)
		, e = d.b;
		b.d !== a.d && (c = !0,
		G(b.d, a.d));
		H(d, a.e);
		H(e, b);
		d.a = a.b.a;
		e.a = b.a;
		d.d = e.d = a.d;
		a.d.a = e;
		c || D(d, a.d);
		return d
	}
	function B(a) {
		var b = new M
		, c = new M
		, d = a.b.h;
		c.h = d;
		d.b.h = b;
		b.h = a;
		a.b.h = c;
		b.b = c;
		b.c = b;
		b.e = c;
		c.b = b;
		c.c = c;
		return c.e = b
	}
	function H(a, b) {
		var c = a.c
		, d = b.c;
		c.b.e = b;
		d.b.e = a;
		a.c = d;
		b.c = c
	}
	function C(a, b) {
		var c = b.f
		, d = new N(b,c);
		c.e = d;
		b.f = d;
		c = d.c = a;
		do
			c.a = d,
			c = c.c;
		while (c !== a)
	}
	function D(a, b) {
		var c = b.d
		, d = new ga(b,c);
		c.b = d;
		b.d = d;
		d.a = a;
		d.c = b.c;
		c = a;
		do
			c.d = d,
			c = c.e;
		while (c !== a)
	}
	function fa(a) {
		var b = a.h;
		a = a.b.h;
		b.b.h = a;
		a.b.h = b
	}
	function F(a, b) {
		var c = a.c
		, d = c;
		do
			d.a = b,
			d = d.c;
		while (d !== c);
		c = a.f;
		d = a.e;
		d.f = c;
		c.e = d
	}
	function G(a, b) {
		var c = a.a
		, d = c;
		do
			d.d = b,
			d = d.e;
		while (d !== c);
		c = a.d;
		d = a.b;
		d.d = c;
		c.b = d
	}
	;function ha(a) {
		var b = 0;
		Math.abs(a[1]) > Math.abs(a[0]) && (b = 1);
		Math.abs(a[2]) > Math.abs(a[b]) && (b = 2);
		return b
	}
	;var O = 4 * 1E150;
	function P(a, b) {
		a.f += b.f;
		a.b.f += b.b.f
	}
	function ia(a, b, c) {
		a = a.a;
		b = b.a;
		c = c.a;
		if (b.b.a === a)
			return c.b.a === a ? u(b.a, c.a) ? 0 >= x(c.b.a, b.a, c.a) : 0 <= x(b.b.a, c.a, b.a) : 0 >= x(c.b.a, a, c.a);
		if (c.b.a === a)
			return 0 <= x(b.b.a, a, b.a);
		b = v(b.b.a, a, b.a);
		a = v(c.b.a, a, c.a);
		return b >= a
	}
	function Q(a) {
		a.a.i = null;
		var b = a.e;
		b.a.c = b.c;
		b.c.a = b.a;
		a.e = null
	}
	function ja(a, b) {
		I(a.a);
		a.c = !1;
		a.a = b;
		b.i = a
	}
	function ka(a) {
		var b = a.a.a;
		do
			a = R(a);
		while (a.a.a === b);
		a.c && (b = L(S(a).a.b, a.a.e),
		ja(a, b),
		a = R(a));
		return a
	}
	function la(a, b, c) {
		var d = new ma;
		d.a = c;
		d.e = na(a.f, b.e, d);
		return c.i = d
	}
	function oa(a, b) {
		switch (a.s) {
		case 100130:
			return 0 !== (b & 1);
		case 100131:
			return 0 !== b;
		case 100132:
			return 0 < b;
		case 100133:
			return 0 > b;
		case 100134:
			return 2 <= b || -2 >= b
		}
		return !1
	}
	function pa(a) {
		var b = a.a
		, c = b.d;
		c.c = a.d;
		c.a = b;
		Q(a)
	}
	function T(a, b, c) {
		a = b;
		for (b = b.a; a !== c; ) {
			a.c = !1;
			var d = S(a)
			, e = d.a;
			if (e.a !== b.a) {
				if (!d.c) {
					pa(a);
					break
				}
				e = L(b.c.b, e.b);
				ja(d, e)
			}
			b.c !== e && (E(J(e), e),
			E(b, e));
			pa(a);
			b = d.a;
			a = d
		}
		return b
	}
	function U(a, b, c, d, e, f) {
		var g = !0;
		do
			la(a, b, c.b),
			c = c.c;
		while (c !== d);
		for (null === e && (e = S(b).a.b.c); ; ) {
			d = S(b);
			c = d.a.b;
			if (c.a !== e.a)
				break;
			c.c !== e && (E(J(c), c),
			E(J(e), c));
			d.f = b.f - c.f;
			d.d = oa(a, d.f);
			b.b = !0;
			!g && qa(a, b) && (P(c, e),
			Q(b),
			I(e));
			g = !1;
			b = d;
			e = c
		}
		b.b = !0;
		f && ra(a, b)
	}
	function sa(a, b, c, d, e) {
		var f = [b.g[0], b.g[1], b.g[2]];
		b.d = null;
		b.d = a.o ? a.o(f, c, d, a.c) || null : null;
		null === b.d && (e ? a.n || (V(a, 100156),
		a.n = !0) : b.d = c[0])
	}
	function ta(a, b, c) {
		var d = [null, null, null, null];
		d[0] = b.a.d;
		d[1] = c.a.d;
		sa(a, b.a, d, [.5, .5, 0, 0], !1);
		E(b, c)
	}
	function ua(a, b, c, d, e) {
		var f = Math.abs(b.b - a.b) + Math.abs(b.a - a.a)
		, g = Math.abs(c.b - a.b) + Math.abs(c.a - a.a)
		, h = e + 1;
		d[e] = .5 * g / (f + g);
		d[h] = .5 * f / (f + g);
		a.g[0] += d[e] * b.g[0] + d[h] * c.g[0];
		a.g[1] += d[e] * b.g[1] + d[h] * c.g[1];
		a.g[2] += d[e] * b.g[2] + d[h] * c.g[2]
	}
	function qa(a, b) {
		var c = S(b)
		, d = b.a
		, e = c.a;
		if (u(d.a, e.a)) {
			if (0 < x(e.b.a, d.a, e.a))
				return !1;
			if (!t(d.a, e.a))
				K(e.b),
				E(d, J(e)),
				b.b = c.b = !0;
			else if (d.a !== e.a) {
				var c = a.e
				, f = d.a.h;
				if (0 <= f) {
					var c = c.b
					, g = c.d
					, h = c.e
					, k = c.c
					, l = k[f];
					g[l] = g[c.a];
					k[g[l]] = l;
					l <= --c.a && (1 >= l ? W(c, l) : u(h[g[l >> 1]], h[g[l]]) ? W(c, l) : va(c, l));
					h[f] = null;
					k[f] = c.b;
					c.b = f
				} else
					for (c.c[-(f + 1)] = null; 0 < c.a && null === c.c[c.d[c.a - 1]]; )
						--c.a;
				ta(a, J(e), d)
			}
		} else {
			if (0 > x(d.b.a, e.a, d.a))
				return !1;
			R(b).b = b.b = !0;
			K(d.b);
			E(J(e), d)
		}
		return !0
	}
	function wa(a, b) {
		var c = S(b)
		, d = b.a
		, e = c.a
		, f = d.a
		, g = e.a
		, h = d.b.a
		, k = e.b.a
		, l = new N;
		x(h, a.a, f);
		x(k, a.a, g);
		if (f === g || Math.min(f.a, h.a) > Math.max(g.a, k.a))
			return !1;
		if (u(f, g)) {
			if (0 < x(k, f, g))
				return !1
		} else if (0 > x(h, g, f))
			return !1;
		var r = h, p = f, q = k, y = g, m, w;
		u(r, p) || (m = r,
		r = p,
		p = m);
		u(q, y) || (m = q,
		q = y,
		y = m);
		u(r, q) || (m = r,
		r = q,
		q = m,
		m = p,
		p = y,
		y = m);
		u(q, p) ? u(p, y) ? (m = v(r, q, p),
		w = v(q, p, y),
		0 > m + w && (m = -m,
		w = -w),
		l.b = A(m, q.b, w, p.b)) : (m = x(r, q, p),
		w = -x(r, y, p),
		0 > m + w && (m = -m,
		w = -w),
		l.b = A(m, q.b, w, y.b)) : l.b = (q.b + p.b) / 2;
		z(r, p) || (m = r,
		r = p,
		p = m);
		z(q, y) || (m = q,
		q = y,
		y = m);
		z(r, q) || (m = r,
		r = q,
		q = m,
		m = p,
		p = y,
		y = m);
		z(q, p) ? z(p, y) ? (m = aa(r, q, p),
		w = aa(q, p, y),
		0 > m + w && (m = -m,
		w = -w),
		l.a = A(m, q.a, w, p.a)) : (m = ba(r, q, p),
		w = -ba(r, y, p),
		0 > m + w && (m = -m,
		w = -w),
		l.a = A(m, q.a, w, y.a)) : l.a = (q.a + p.a) / 2;
		u(l, a.a) && (l.b = a.a.b,
		l.a = a.a.a);
		r = u(f, g) ? f : g;
		u(r, l) && (l.b = r.b,
		l.a = r.a);
		if (t(l, f) || t(l, g))
			return qa(a, b),
			!1;
		if (!t(h, a.a) && 0 <= x(h, a.a, l) || !t(k, a.a) && 0 >= x(k, a.a, l)) {
			if (k === a.a)
				return K(d.b),
				E(e.b, d),
				b = ka(b),
				d = S(b).a,
				T(a, S(b), c),
				U(a, b, J(d), d, d, !0),
				!0;
			if (h === a.a) {
				K(e.b);
				E(d.e, J(e));
				f = c = b;
				g = f.a.b.a;
				do
					f = R(f);
				while (f.a.b.a === g);
				b = f;
				f = S(b).a.b.c;
				c.a = J(e);
				e = T(a, c, null);
				U(a, b, e.c, d.b.c, f, !0);
				return !0
			}
			0 <= x(h, a.a, l) && (R(b).b = b.b = !0,
			K(d.b),
			d.a.b = a.a.b,
			d.a.a = a.a.a);
			0 >= x(k, a.a, l) && (b.b = c.b = !0,
			K(e.b),
			e.a.b = a.a.b,
			e.a.a = a.a.a);
			return !1
		}
		K(d.b);
		K(e.b);
		E(J(e), d);
		d.a.b = l.b;
		d.a.a = l.a;
		d.a.h = xa(a.e, d.a);
		d = d.a;
		e = [0, 0, 0, 0];
		l = [f.d, h.d, g.d, k.d];
		d.g[0] = d.g[1] = d.g[2] = 0;
		ua(d, f, h, e, 0);
		ua(d, g, k, e, 2);
		sa(a, d, l, e, !0);
		R(b).b = b.b = c.b = !0;
		return !1
	}
	function ra(a, b) {
		for (var c = S(b); ; ) {
			for (; c.b; )
				b = c,
				c = S(c);
			if (!b.b && (c = b,
			b = R(b),
			null === b || !b.b))
				break;
			b.b = !1;
			var d = b.a, e = c.a, f;
			if (f = d.b.a !== e.b.a)
				a: {
					f = b;
					var g = S(f)
					, h = f.a
					, k = g.a
					, l = void 0;
					if (u(h.b.a, k.b.a)) {
						if (0 > x(h.b.a, k.b.a, h.a)) {
							f = !1;
							break a
						}
						R(f).b = f.b = !0;
						l = K(h);
						E(k.b, l);
						l.d.c = f.d
					} else {
						if (0 < x(k.b.a, h.b.a, k.a)) {
							f = !1;
							break a
						}
						f.b = g.b = !0;
						l = K(k);
						E(h.e, k.b);
						l.b.d.c = f.d
					}
					f = !0
				}
			f && (c.c ? (Q(c),
			I(e),
			c = S(b),
			e = c.a) : b.c && (Q(b),
			I(d),
			b = R(c),
			d = b.a));
			if (d.a !== e.a)
				if (d.b.a === e.b.a || b.c || c.c || d.b.a !== a.a && e.b.a !== a.a)
					qa(a, b);
				else if (wa(a, b))
					break;
			d.a === e.a && d.b.a === e.b.a && (P(e, d),
			Q(b),
			I(d),
			b = R(c))
		}
	}
	function ya(a, b) {
		a.a = b;
		for (var c = b.c; null === c.i; )
			if (c = c.c,
			c === b.c) {
				var c = a
				, d = b
				, e = new ma;
				e.a = d.c.b;
				var f = c.f
				, g = f.a;
				do
					g = g.a;
				while (null !== g.b && !f.c(f.b, e, g.b));
				var f = g.b
				, h = S(f)
				, e = f.a
				, g = h.a;
				if (0 === x(e.b.a, d, e.a))
					e = f.a,
					t(e.a, d) || t(e.b.a, d) || (K(e.b),
					f.c && (I(e.c),
					f.c = !1),
					E(d.c, e),
					ya(c, d));
				else {
					var k = u(g.b.a, e.b.a) ? f : h
					, h = void 0;
					f.d || k.c ? (k === f ? h = L(d.c.b, e.e) : h = L(g.b.c.b, d.c).b,
					k.c ? ja(k, h) : (e = c,
					f = la(c, f, h),
					f.f = R(f).f + f.a.f,
					f.d = oa(e, f.f)),
					ya(c, d)) : U(c, f, d.c, d.c, null, !0)
				}
				return
			}
		c = ka(c.i);
		e = S(c);
		f = e.a;
		e = T(a, e, null);
		if (e.c === f) {
			var f = e
			, e = f.c
			, g = S(c)
			, h = c.a
			, k = g.a
			, l = !1;
			h.b.a !== k.b.a && wa(a, c);
			t(h.a, a.a) && (E(J(e), h),
			c = ka(c),
			e = S(c).a,
			T(a, S(c), g),
			l = !0);
			t(k.a, a.a) && (E(f, J(k)),
			f = T(a, g, null),
			l = !0);
			l ? U(a, c, f.c, e, e, !0) : (u(k.a, h.a) ? d = J(k) : d = h,
			d = L(f.c.b, d),
			U(a, c, d, d.c, d.c, !1),
			d.b.i.c = !0,
			ra(a, c))
		} else
			U(a, c, e.c, f, f, !0)
	}
	function za(a, b) {
		var c = new ma
		, d = ea(a.b);
		d.a.b = O;
		d.a.a = b;
		d.b.a.b = -O;
		d.b.a.a = b;
		a.a = d.b.a;
		c.a = d;
		c.f = 0;
		c.d = !1;
		c.c = !1;
		c.h = !0;
		c.b = !1;
		d = a.f;
		d = na(d, d.a, c);
		c.e = d
	}
	;function Aa(a) {
		this.a = new Ba;
		this.b = a;
		this.c = ia
	}
	function na(a, b, c) {
		do
			b = b.c;
		while (null !== b.b && !a.c(a.b, b.b, c));
		a = new Ba(c,b.a,b);
		b.a.c = a;
		return b.a = a
	}
	;function Ba(a, b, c) {
		this.b = a || null;
		this.a = b || this;
		this.c = c || this
	}
	;function X() {
		this.d = Y;
		this.p = this.b = this.q = null;
		this.j = [0, 0, 0];
		this.s = 100130;
		this.n = !1;
		this.o = this.a = this.e = this.f = null;
		this.m = !1;
		this.c = this.r = this.i = this.k = this.l = this.h = null
	}
	var Y = 0;
	n = X.prototype;
	n.x = function() {
		Z(this, Y)
	}
	;
	n.B = function(a, b) {
		switch (a) {
		case 100142:
			return;
		case 100140:
			switch (b) {
			case 100130:
			case 100131:
			case 100132:
			case 100133:
			case 100134:
				this.s = b;
				return
			}
			break;
		case 100141:
			this.m = !!b;
			return;
		default:
			V(this, 100900);
			return
		}
		V(this, 100901)
	}
	;
	n.y = function(a) {
		switch (a) {
		case 100142:
			return 0;
		case 100140:
			return this.s;
		case 100141:
			return this.m;
		default:
			V(this, 100900)
		}
		return !1
	}
	;
	n.A = function(a, b, c) {
		this.j[0] = a;
		this.j[1] = b;
		this.j[2] = c
	}
	;
	n.z = function(a, b) {
		var c = b ? b : null;
		switch (a) {
		case 100100:
		case 100106:
			this.h = c;
			break;
		case 100104:
		case 100110:
			this.l = c;
			break;
		case 100101:
		case 100107:
			this.k = c;
			break;
		case 100102:
		case 100108:
			this.i = c;
			break;
		case 100103:
		case 100109:
			this.p = c;
			break;
		case 100105:
		case 100111:
			this.o = c;
			break;
		case 100112:
			this.r = c;
			break;
		default:
			V(this, 100900)
		}
	}
	;
	n.C = function(a, b) {
		var c = !1
		, d = [0, 0, 0];
		Z(this, 2);
		for (var e = 0; 3 > e; ++e) {
			var f = a[e];
			-1E150 > f && (f = -1E150,
			c = !0);
			1E150 < f && (f = 1E150,
			c = !0);
			d[e] = f
		}
		c && V(this, 100155);
		c = this.q;
		null === c ? (c = ea(this.b),
		E(c, c.b)) : (K(c),
		c = c.e);
		c.a.d = b;
		c.a.g[0] = d[0];
		c.a.g[1] = d[1];
		c.a.g[2] = d[2];
		c.f = 1;
		c.b.f = -1;
		this.q = c
	}
	;
	n.u = function(a) {
		Z(this, Y);
		this.d = 1;
		this.b = new Ca;
		this.c = a
	}
	;
	n.t = function() {
		Z(this, 1);
		this.d = 2;
		this.q = null
	}
	;
	n.v = function() {
		Z(this, 2);
		this.d = 1
	}
	;
	n.w = function() {
		Z(this, 1);
		this.d = Y;
		var a = this.j[0]
		, b = this.j[1]
		, c = this.j[2]
		, d = !1
		, e = [a, b, c];
		if (0 === a && 0 === b && 0 === c) {
			for (var b = [-2 * 1E150, -2 * 1E150, -2 * 1E150], f = [2 * 1E150, 2 * 1E150, 2 * 1E150], c = [], g = [], d = this.b.c, a = d.e; a !== d; a = a.e)
				for (var h = 0; 3 > h; ++h) {
					var k = a.g[h];
					k < f[h] && (f[h] = k,
					g[h] = a);
					k > b[h] && (b[h] = k,
					c[h] = a)
				}
			a = 0;
			b[1] - f[1] > b[0] - f[0] && (a = 1);
			b[2] - f[2] > b[a] - f[a] && (a = 2);
			if (f[a] >= b[a])
				e[0] = 0,
				e[1] = 0,
				e[2] = 1;
			else {
				b = 0;
				f = g[a];
				c = c[a];
				g = [0, 0, 0];
				f = [f.g[0] - c.g[0], f.g[1] - c.g[1], f.g[2] - c.g[2]];
				h = [0, 0, 0];
				for (a = d.e; a !== d; a = a.e)
					h[0] = a.g[0] - c.g[0],
					h[1] = a.g[1] - c.g[1],
					h[2] = a.g[2] - c.g[2],
					g[0] = f[1] * h[2] - f[2] * h[1],
					g[1] = f[2] * h[0] - f[0] * h[2],
					g[2] = f[0] * h[1] - f[1] * h[0],
					k = g[0] * g[0] + g[1] * g[1] + g[2] * g[2],
					k > b && (b = k,
					e[0] = g[0],
					e[1] = g[1],
					e[2] = g[2]);
				0 >= b && (e[0] = e[1] = e[2] = 0,
				e[ha(f)] = 1)
			}
			d = !0
		}
		g = ha(e);
		a = this.b.c;
		b = (g + 1) % 3;
		c = (g + 2) % 3;
		g = 0 < e[g] ? 1 : -1;
		for (e = a.e; e !== a; e = e.e)
			e.b = e.g[b],
			e.a = g * e.g[c];
		if (d) {
			e = 0;
			d = this.b.a;
			for (a = d.b; a !== d; a = a.b)
				if (b = a.a,
				!(0 >= b.f)) {
					do
						e += (b.a.b - b.b.a.b) * (b.a.a + b.b.a.a),
						b = b.e;
					while (b !== a.a)
				}
			if (0 > e)
				for (e = this.b.c,
				d = e.e; d !== e; d = d.e)
					d.a = -d.a
		}
		this.n = !1;
		e = this.b.b;
		for (a = e.h; a !== e; a = d)
			if (d = a.h,
			b = a.e,
			t(a.a, a.b.a) && a.e.e !== a && (ta(this, b, a),
			I(a),
			a = b,
			b = a.e),
			b.e === a) {
				if (b !== a) {
					if (b === d || b === d.b)
						d = d.h;
					I(b)
				}
				if (a === d || a === d.b)
					d = d.h;
				I(a)
			}
		this.e = e = new Da;
		d = this.b.c;
		for (a = d.e; a !== d; a = a.e)
			a.h = xa(e, a);
		Ea(e);
		this.f = new Aa(this);
		za(this, -O);
		for (za(this, O); null !== (e = Fa(this.e)); ) {
			for (; ; ) {
				a: if (a = this.e,
				0 === a.a)
					d = Ga(a.b);
				else if (d = a.c[a.d[a.a - 1]],
				0 !== a.b.a && (a = Ga(a.b),
				u(a, d))) {
					d = a;
					break a
				}
				if (null === d || !t(d, e))
					break;
				d = Fa(this.e);
				ta(this, e.c, d.c)
			}
			ya(this, e)
		}
		this.a = this.f.a.a.b.a.a;
		for (e = 0; null !== (d = this.f.a.a.b); )
			d.h || ++e,
			Q(d);
		this.f = null;
		e = this.e;
		e.b = null;
		e.d = null;
		this.e = e.c = null;
		e = this.b;
		for (a = e.a.b; a !== e.a; a = d)
			d = a.b,
			a = a.a,
			a.e.e === a && (P(a.c, a),
			I(a));
		if (!this.n) {
			e = this.b;
			if (this.m)
				for (a = e.b.h; a !== e.b; a = d)
					d = a.h,
					a.b.d.c !== a.d.c ? a.f = a.d.c ? 1 : -1 : I(a);
			else
				for (a = e.a.b; a !== e.a; a = d)
					if (d = a.b,
					a.c) {
						for (a = a.a; u(a.b.a, a.a); a = a.c.b)
							;
						for (; u(a.a, a.b.a); a = a.e)
							;
						b = a.c.b;
						for (c = void 0; a.e !== b; )
							if (u(a.b.a, b.a)) {
								for (; b.e !== a && (ca(b.e) || 0 >= x(b.a, b.b.a, b.e.b.a)); )
									c = L(b.e, b),
									b = c.b;
								b = b.c.b
							} else {
								for (; b.e !== a && (da(a.c.b) || 0 <= x(a.b.a, a.a, a.c.b.a)); )
									c = L(a, a.c.b),
									a = c.b;
								a = a.e
							}
						for (; b.e.e !== a; )
							c = L(b.e, b),
							b = c.b
					}
			if (this.h || this.i || this.k || this.l)
				if (this.m)
					for (e = this.b,
					d = e.a.b; d !== e.a; d = d.b) {
						if (d.c) {
							this.h && this.h(2, this.c);
							a = d.a;
							do
								this.k && this.k(a.a.d, this.c),
								a = a.e;
							while (a !== d.a);
							this.i && this.i(this.c)
						}
					}
				else {
					e = this.b;
					d = !!this.l;
					a = !1;
					b = -1;
					for (c = e.a.d; c !== e.a; c = c.d)
						if (c.c) {
							a || (this.h && this.h(4, this.c),
							a = !0);
							g = c.a;
							do
								d && (f = g.b.d.c ? 0 : 1,
								b !== f && (b = f,
								this.l && this.l(!!b, this.c))),
								this.k && this.k(g.a.d, this.c),
								g = g.e;
							while (g !== c.a)
						}
					a && this.i && this.i(this.c)
				}
			if (this.r) {
				e = this.b;
				for (a = e.a.b; a !== e.a; a = d)
					if (d = a.b,
					!a.c) {
						b = a.a;
						c = b.e;
						g = void 0;
						do
							g = c,
							c = g.e,
							g.d = null,
							null === g.b.d && (g.c === g ? F(g.a, null) : (g.a.c = g.c,
							H(g, J(g))),
							f = g.b,
							f.c === f ? F(f.a, null) : (f.a.c = f.c,
							H(f, J(f))),
							fa(g));
						while (g !== b);
						b = a.d;
						a = a.b;
						a.d = b;
						b.b = a
					}
				this.r(this.b);
				this.c = this.b = null;
				return
			}
		}
		this.b = this.c = null
	}
	;
	function Z(a, b) {
		if (a.d !== b)
			for (; a.d !== b; )
				if (a.d < b)
					switch (a.d) {
					case Y:
						V(a, 100151);
						a.u(null);
						break;
					case 1:
						V(a, 100152),
						a.t()
					}
				else
					switch (a.d) {
					case 2:
						V(a, 100154);
						a.v();
						break;
					case 1:
						V(a, 100153),
						a.w()
					}
	}
	function V(a, b) {
		a.p && a.p(b, a.c)
	}
	;function ga(a, b) {
		this.b = a || this;
		this.d = b || this;
		this.a = null;
		this.c = !1
	}
	;function M() {
		this.h = this;
		this.i = this.d = this.a = this.e = this.c = this.b = null;
		this.f = 0
	}
	function J(a) {
		return a.b.e
	}
	;function Ca() {
		this.c = new N;
		this.a = new ga;
		this.b = new M;
		this.d = new M;
		this.b.b = this.d;
		this.d.b = this.b
	}
	;function N(a, b) {
		this.e = a || this;
		this.f = b || this;
		this.d = this.c = null;
		this.g = [0, 0, 0];
		this.h = this.a = this.b = 0
	}
	;function Da() {
		this.c = [];
		this.d = null;
		this.a = 0;
		this.e = !1;
		this.b = new Ha
	}
	function Ea(a) {
		a.d = [];
		for (var b = 0; b < a.a; b++)
			a.d[b] = b;
		a.d.sort(function(a) {
			return function(b, e) {
				return u(a[b], a[e]) ? 1 : -1
			}
		}(a.c));
		a.e = !0;
		Ia(a.b)
	}
	function xa(a, b) {
		if (a.e) {
			var c = a.b
			, d = ++c.a;
			2 * d > c.f && (c.f *= 2,
			c.c = Ja(c.c, c.f + 1));
			var e;
			0 === c.b ? e = d : (e = c.b,
			c.b = c.c[c.b]);
			c.e[e] = b;
			c.c[e] = d;
			c.d[d] = e;
			c.h && va(c, d);
			return e
		}
		c = a.a++;
		a.c[c] = b;
		return -(c + 1)
	}
	;function Fa(a) {
		if (0 === a.a)
			return Ka(a.b);
		var b = a.c[a.d[a.a - 1]];
		if (0 !== a.b.a && u(Ga(a.b), b))
			return Ka(a.b);
		do
			--a.a;
		while (0 < a.a && null === a.c[a.d[a.a - 1]]);
		return b
	}
	;function Ha() {
		this.d = Ja([0], 33);
		this.e = [null, null];
		this.c = [0, 0];
		this.a = 0;
		this.f = 32;
		this.b = 0;
		this.h = !1;
		this.d[1] = 1
	}
	function Ja(a, b) {
		for (var c = Array(b), d = 0; d < a.length; d++)
			c[d] = a[d];
		for (; d < b; d++)
			c[d] = 0;
		return c
	}
	function Ia(a) {
		for (var b = a.a; 1 <= b; --b)
			W(a, b);
		a.h = !0
	}
	function Ga(a) {
		return a.e[a.d[1]]
	}
	function Ka(a) {
		var b = a.d
		, c = a.e
		, d = a.c
		, e = b[1]
		, f = c[e];
		0 < a.a && (b[1] = b[a.a],
		d[b[1]] = 1,
		c[e] = null,
		d[e] = a.b,
		a.b = e,
		0 < --a.a && W(a, 1));
		return f
	}
	;function W(a, b) {
		for (var c = a.d, d = a.e, e = a.c, f = b, g = c[f]; ; ) {
			var h = f << 1;
			h < a.a && u(d[c[h + 1]], d[c[h]]) && (h += 1);
			var k = c[h];
			if (h > a.a || u(d[g], d[k])) {
				c[f] = g;
				e[g] = f;
				break
			}
			c[f] = k;
			e[k] = f;
			f = h
		}
	}
	function va(a, b) {
		for (var c = a.d, d = a.e, e = a.c, f = b, g = c[f]; ; ) {
			var h = f >> 1
			, k = c[h];
			if (0 === h || u(d[k], d[g])) {
				c[f] = g;
				e[g] = f;
				break
			}
			c[f] = k;
			e[k] = f;
			f = h
		}
	}
	;function ma() {
		this.e = this.a = null;
		this.f = 0;
		this.c = this.b = this.h = this.d = !1
	}
	function S(a) {
		return a.e.c.b
	}
	function R(a) {
		return a.e.a.b
	}
	;
	var _ = {
		GluTesselator: X,
		windingRule: {
			GLU_TESS_WINDING_ODD: 100130,
			GLU_TESS_WINDING_NONZERO: 100131,
			GLU_TESS_WINDING_POSITIVE: 100132,
			GLU_TESS_WINDING_NEGATIVE: 100133,
			GLU_TESS_WINDING_ABS_GEQ_TWO: 100134
		},
		primitiveType: {
			GL_LINE_LOOP: 2,
			GL_TRIANGLES: 4,
			GL_TRIANGLE_STRIP: 5,
			GL_TRIANGLE_FAN: 6
		},
		errorType: {
			GLU_TESS_MISSING_BEGIN_POLYGON: 100151,
			GLU_TESS_MISSING_END_POLYGON: 100153,
			GLU_TESS_MISSING_BEGIN_CONTOUR: 100152,
			GLU_TESS_MISSING_END_CONTOUR: 100154,
			GLU_TESS_COORD_TOO_LARGE: 100155,
			GLU_TESS_NEED_COMBINE_CALLBACK: 100156
		},
		gluEnum: {
			GLU_TESS_MESH: 100112,
			GLU_TESS_TOLERANCE: 100142,
			GLU_TESS_WINDING_RULE: 100140,
			GLU_TESS_BOUNDARY_ONLY: 100141,
			GLU_INVALID_ENUM: 100900,
			GLU_INVALID_VALUE: 100901,
			GLU_TESS_BEGIN: 100100,
			GLU_TESS_VERTEX: 100101,
			GLU_TESS_END: 100102,
			GLU_TESS_ERROR: 100103,
			GLU_TESS_EDGE_FLAG: 100104,
			GLU_TESS_COMBINE: 100105,
			GLU_TESS_BEGIN_DATA: 100106,
			GLU_TESS_VERTEX_DATA: 100107,
			GLU_TESS_END_DATA: 100108,
			GLU_TESS_ERROR_DATA: 100109,
			GLU_TESS_EDGE_FLAG_DATA: 100110,
			GLU_TESS_COMBINE_DATA: 100111
		}
	};
	X.prototype.gluDeleteTess = X.prototype.x;
	X.prototype.gluTessProperty = X.prototype.B;
	X.prototype.gluGetTessProperty = X.prototype.y;
	X.prototype.gluTessNormal = X.prototype.A;
	X.prototype.gluTessCallback = X.prototype.z;
	X.prototype.gluTessVertex = X.prototype.C;
	X.prototype.gluTessBeginPolygon = X.prototype.u;
	X.prototype.gluTessBeginContour = X.prototype.t;
	X.prototype.gluTessEndContour = X.prototype.v;
	X.prototype.gluTessEndPolygon = X.prototype.w;
	return _;
}());
var AT_Tess = (function() {
	var tessy = (function initTesselator() {
		// function called for each vertex of tesselator output
		function vertexCallback(data, polyVertArray) {
		  // console.log(data[0], data[1]);
		  polyVertArray[polyVertArray.length] = data[0];
		  polyVertArray[polyVertArray.length] = data[1];
		}
		function begincallback(type) {
		  if (type !== libtess.primitiveType.GL_TRIANGLES) {
			console.log('expected TRIANGLES but got type: ' + type);
		  }
		}
		function errorcallback(errno) {
		  console.log('error callback');
		  console.log('error number: ' + errno);
		}
		// callback for when segments intersect and must be split
		function combinecallback(coords, data, weight) {
		  // console.log('combine callback');
		  return [coords[0], coords[1], coords[2]];
		}
		function edgeCallback(flag) {
		  // don't really care about the flag, but need no-strip/no-fan behavior
		  // console.log('edge flag: ' + flag);
		}

		var tessy = new libtess.GluTesselator();
		// tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
		tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
		tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
		tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
		tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
		tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

		return tessy;
	})();
	function TaskList() {
		this.list = [];
		this.hash = Object.create(null);
	}
	TaskList.prototype.push = function(index) {
		if (this.hash[index]) return;
		this.hash[index] = true;
		this.list.push(index);
	};
	TaskList.prototype.pop = function() {
		if (this.list.length) {
			var value = this.list.pop();
			delete this.hash[value];
			return value;
		} else return null;
	};
	
	/* Union-find functions */
	
	function unionFindUnion(obj1, obj2) {
		var root1 = unionFindFind(obj1);
		var root2 = unionFindFind(obj2);
		if (root1 !== root2) {
			if (root1.rank < root2.rank) {
				root1.parent = root2;
			} else {
				root2.parent = root1;
				if (root1.rank === root2.rank) root1.rank += 1;
			}
		}
	}
	
	function unionFindFind(x) {
		if (x.parent !== x) x.parent = unionFindFind(x.parent);
		return x.parent;
	}
	
	/* Fast collision test for rectangles*/
	
	function subTest(p1, p2 , r) {
		var position;
		var norm = norm2(p1, p2);
		var product, localPosition;
		for (var i = 0; i < 4; i++) {
			product = innerProduct(p1, p2, p1, r[i]);
			if (product <= 0) localPosition = -1;
			else if (product >= norm) localPosition = 1;
			else return false;
			if (i === 0) {
				position = localPosition;
			} else {
				if (localPosition !== position) {
					return false;
				}
			}
		}
		return true;
	}
	
	function rectanglesCollide(r1, r2) {
		return !(subTest(r1[0], r1[1], r2) || subTest(r1[1], r1[2], r2) || subTest(r2[0], r2[1], r1) || subTest(r2[1], r2[2], r1));
	}
	
	/* Geometry helpers */
	
	function innerProduct(p1, p2, p3, p4) {
		return (p2[0] - p1[0]) * (p4[0] - p3[0]) + (p2[1] - p1[1]) * (p4[1] - p3[1]);
	}
	function norm2(p1, p2) {
		var dx = p2[0] - p1[0];
		var dy = p2[1] - p1[1];
		return dx * dx + dy * dy;
	}
	
	function segmentIntersection(p1, p2, p3, p4) {
		// find intersection point of [p1, p2] and [p3, p4], supposing it exists
		var dx = p2[0] - p1[0];
		var dy = p2[1] - p1[1];
		var dx2 = p4[0] - p3[0];
		var dy2 = p4[1] - p3[1];
		var lambda = ((p2[0] - p3[0]) * dy - dx * (p2[1] - p3[1])) /
			(dx2 * dy - dx * dy2);
		return [p3[0] + lambda * dx2, p3[1] + lambda * dy2];
	}
	function rayIntersection(p1, p2, p3, p4) {
		// find intersection point of (p1, p2] and (p3, p4]
		var dx = p2[0] - p1[0];
		var dy = p2[1] - p1[1];
		var dx2 = p4[0] - p3[0];
		var dy2 = p4[1] - p3[1];
		var denom = dx2 * dy - dx * dy2;
		if (denom === 0) return {point: p1, valid: true};
		var lambda = ((p2[0] - p3[0]) * dy - dx * (p2[1] - p3[1])) / denom;
		var inter = [p3[0] + lambda * dx2, p3[1] + lambda * dy2];
		if (lambda > 1 || innerProduct(p2, inter, p2, p1) < 0) return {point: inter, valid: false};
		else return {point: inter, valid: true};
	}
	
	function getData(from, to, w) {
		var ux = to[0] - from[0];
		var uy = to[1] - from [1];
		var Nu = Math.sqrt(ux * ux + uy * uy);
		var theta = Math.acos(ux / Nu);
		if (uy < 0) theta *= -1;
		return {
			angle: theta,
			norm: Nu,
			dir: [ux, uy],
			ortho: [- w * uy / Nu, w * ux / Nu]
		};
	}
	
	/* main function */
	
	function graphDraw(graph, width, cb, maxAngle) {
		var w = width / 2;
		maxAngle = Math.max(Math.PI, maxAngle || 2 * Math.PI);
		/* Data structures setup */
	
		var vertices = graph.vertices.map(function(coords) {
			return {
				coords: coords,
				neighList: []
			};
		});
		var edges = graph.edges.map(function(edge, index) {
			var from = edge[0];
			var to = edge[1];
			var vertexFrom = vertices[from];
			var vertexTo = vertices[to];
			var data = getData(vertexFrom.coords, vertexTo.coords, w);
			vertexFrom.neighList.push({
				to: to,
				angle: data.angle,
				dir: data.dir,
				ortho: data.ortho,
				index: index
			});
			vertexTo.neighList.push({
				to: from,
				angle: data.angle <= 0 ? data.angle + Math.PI : data.angle - Math.PI,
				dir: [-data.dir[0], -data.dir[1]],
				ortho: [-data.ortho[0], -data.ortho[1]],
				index: index
			});
			var obj = {
				rank: 0,
				edge: edge,
				points: {}
			};
			obj.points[to] = {};
			obj.points[from] = {};
			obj.parent = obj;
			return obj;
		});
	
		/* Build edges contour points */
	
		var toPostProcess = [];
		vertices.forEach(function(vertex, vindex) {
			var point = vertex.coords;
			var prepared = vertex.neighList;
			prepared.sort(function(a, b) {return a.angle - b.angle;});
			var n = prepared.length;
			if (n === 1) {
				var edge = prepared[0];
				var p1 = [point[0] + edge.ortho[0], point[1] + edge.ortho[1]];
				var p2 = [point[0] - edge.ortho[0], point[1] - edge.ortho[1]];
				var edgePoints = edges[edge.index].points;
				edgePoints[vindex].first_vertex = edge.index;
				edgePoints[vindex].last_vertex = edge.index;
				edgePoints[vindex].first = p1;
				edgePoints[vindex].remove_middle_first = true;
				edgePoints[vindex].remove_middle_last = true;
				edgePoints[vindex].last = p2;
			} else {
				prepared.forEach(function(edge, index) {
					var last = (index === n - 1);
					var next = prepared[last ? 0 : index + 1];
					var edgePoints = edges[edge.index].points;
					var nextPoints = edges[next.index].points;
					edgePoints[vindex].first_vertex = next.index;
					nextPoints[vindex].last_vertex = edge.index;
					var p1 = [point[0] + edge.ortho[0], point[1] + edge.ortho[1]];
					var p2 = [p1[0] + edge.dir[0], p1[1] + edge.dir[1]];
					var p3 = [point[0] - next.ortho[0], point[1] - next.ortho[1]];
					var p4 = [p3[0] + next.dir[0], p3[1] + next.dir[1]];
					var intersection = rayIntersection(p1, p2, p3, p4);
					var newPoint = intersection.point;
					if (intersection.valid) {
						var nextAngle = last ? next.angle + 2 * Math.PI : next.angle;
						if (nextAngle - edge.angle > maxAngle) {
							edgePoints[vindex].first = p1;
							nextPoints[vindex].last = p3;
							var vec = [newPoint[0] - point[0], newPoint[1] - point[1]];
							var invNorm = 1 / Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
							edgePoints[vindex].miter_first = nextPoints[vindex].miter_last = [
								point[0] + w * vec[0] * invNorm,
								point[1] + w * vec[1] * invNorm
							];
						} else {
							edgePoints[vindex].first = newPoint;
							nextPoints[vindex].last = newPoint;
						}
						if (n === 2) {
							edgePoints[vindex].remove_middle_first = true;
							nextPoints[vindex].remove_middle_last = true;
						}
					} else {
						var q1 = [newPoint[0] - edge.ortho[0], newPoint[1] - edge.ortho[1]];
						var q3 = [newPoint[0] + next.ortho[0], newPoint[1] + next.ortho[1]];
	
						toPostProcess.push({
							done: [edge.index, next.index],
							todo: [vindex, edge.to, next.to],
							rectangles: [[p1, newPoint, q1, point], [p3, newPoint, q3, point]]
						});
	
						edgePoints[vindex].first = p1;
						nextPoints[vindex].last = p3;
					}
				});
			}
		});
	
		/* Build each edge polygon */
	
		edges.forEach(function(obj) {
			var edge = obj.edge;
			var from = edge[0];
			var to = edge[1];
			var obj1 = obj.points[from];
			var obj2 = obj.points[to];
			var fromCoords = vertices[from].coords;
			var toCoords = vertices[to].coords;
			var newPoly = obj.polygon = [];
	
			if (innerProduct(obj1.last, obj2.first, fromCoords, toCoords) < 0) {
				var i1 = obj1.last_vertex;
				var i2 = obj2.first_vertex;
				unionFindUnion(edges[i1], edges[i2]);
				newPoly.push(segmentIntersection(obj1.miter_last || fromCoords, obj1.last, obj2.first, obj2.miter_first || toCoords));
			} else {
				newPoly.push(obj1.last, obj2.first);
			}
			if (obj2.miter_first) newPoly.push(obj2.miter_first);
			if (!(obj2.remove_middle_first && obj2.remove_middle_last)) newPoly.push(toCoords);
			if (obj2.miter_last) newPoly.push(obj2.miter_last);
			if (innerProduct(obj1.first, obj2.last, fromCoords, toCoords) < 0) {
				var i1 = obj1.first_vertex;
				var i2 = obj2.last_vertex;
				unionFindUnion(edges[i1], edges[i2]);
				newPoly.push(segmentIntersection(obj1.first, obj1.miter_first || fromCoords, obj2.miter_last || toCoords, obj2.last));
			} else {
				newPoly.push(obj2.last, obj1.first);
			}
			if (obj1.miter_first) newPoly.push(obj1.miter_first);
			if (!(obj1.remove_middle_first && obj1.remove_middle_last)) newPoly.push(fromCoords);
			if (obj1.miter_last) newPoly.push(obj1.miter_last);
		});
	
		/* Find locally overlapping edges */
	
		var shapeMemo = Object.create(null);
	
		toPostProcess.forEach(function(obj) {
			var done = Object.create(null);
			var i1 = obj.done[0];
			var i2 = obj.done[1];
			var e1 = edges[i1];
			var e2 = edges[i2];
			unionFindUnion(e1, e2);
			done[i1] = true;
			done[i2] = true;
			var todo = new TaskList();
			obj.todo.forEach(function(vertex) {
				todo.push(vertex);
			});
			var from;
			var r1 = obj.rectangles[0];
			var r2 = obj.rectangles[1];
			while((from = todo.pop()) !== null) {
				vertices[from].neighList.forEach(function(neigh) {
					var index = neigh.index;
					if (done[index]) return;
					var to = neigh.to;
					var rectangle = shapeMemo[index];
					if (!rectangle) {
						var fromCoords = vertices[from].coords;
						var toCoords = vertices[to].coords;
						var p1 = [fromCoords[0] + neigh.ortho[0], fromCoords[1] + neigh.ortho[1]];
						var p2 = [toCoords[0] + neigh.ortho[0], toCoords[1] + neigh.ortho[1]];
						var p3 = [toCoords[0] - neigh.ortho[0], toCoords[1] - neigh.ortho[1]];
						var p4 = [fromCoords[0] - neigh.ortho[0], fromCoords[1] - neigh.ortho[1]];
						rectangle = shapeMemo[index] = [p1, p2, p3, p4];
					}
					done[index] = true;
					if (rectanglesCollide(rectangle, r1) || rectanglesCollide(rectangle, r2)) {
						unionFindUnion(e1, edges[index]);
						todo.push(to);
					}
				});
			}
		});
	
		/* Execute cb on each polygon */
	
		var needUnion = [];
		edges.forEach(function(obj, index) {
			if (obj.rank > 0 && obj.parent === obj) {
				obj.union = obj.union || [];
				obj.union.push(obj.polygon);
				needUnion.push(index);
			} else {
				if (obj.parent === obj) {
					cb(obj.polygon);
				} else {
					var root = unionFindFind(obj);
					root.union = root.union || [];
					root.union.push(obj.polygon);
				}
			}
		});
	}
	function triangulate(contours) {
		tessy.gluTessNormal(0, 0, 1);
		var triangleVerts = [];
		tessy.gluTessBeginPolygon(triangleVerts);
		for (var i = 0; i < contours.length; i++) {
		  tessy.gluTessBeginContour();
		  var contour = contours[i];
		  for (var j = 0; j < contour.length; j += 2) {
			var coords = [contour[j], contour[j + 1], 0];
			tessy.gluTessVertex(coords, coords);
		  }
		  tessy.gluTessEndContour();
		}
		tessy.gluTessEndPolygon();
		return triangleVerts;
	}
	return {
		stroke: function(arrs, width) {
			var vex = [];
			for (let i = 0; i < arrs.length; i++) {
				var _arr = arrs[i];
				if (_arr.length < 4) continue;
				var vertices = [];
				var edges = [];
				var id = 0;
				for (let j = 0; j < _arr.length; j+=2) {
					var fs1 = _arr[j];
					var fs2 = _arr[j + 1];
					if (j == 0) {
						vertices.push([fs1, fs2])
					} else {
						vertices.push([fs1, fs2])
						edges.push([id - 1, id]);
					}
					id++;
				}
				graphDraw({vertices, edges}, width, function(fhfg) {
					var r = [];
					for (let j = 0; j < fhfg.length; j++) {
						const s = fhfg[j];
						if (!(isNaN(s[0]) || isNaN(s[1]))) {
							r.push(s[0]);
							r.push(s[1]);
						}
					}
					vex.push(...triangulate([r]));
				});
			}
			return vex;
		},
		fill: triangulate
	}
}());
var AT_JPG_Decoder = function() {
	const t = new Uint8Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
	function e() {}
	function n(t, e) {
		let n = 0
		  , i = 16;
		const o = [];
		for (; i > 0 && !t[i - 1]; )
			i--;
		o.push({
			children: [],
			index: 0
		});
		let r, s = o[0];
		for (let a = 0; a < i; a++) {
			for (let i = 0; i < t[a]; i++) {
				for (s = o.pop(),
				s.children[s.index] = e[n]; s.index > 0; )
					s = o.pop();
				for (s.index++,
				o.push(s); o.length <= a; )
					o.push(r = {
						children: [],
						index: 0
					}),
					s.children[s.index] = r.children,
					s = r;
				n++
			}
			a + 1 < i && (o.push(r = {
				children: [],
				index: 0
			}),
			s.children[s.index] = r.children,
			s = r)
		}
		return o[0].children
	}
	function i(t, e, n) {
		return 64 * ((t.blocksPerLine + 1) * e + n)
	}
	function o(e, n, o, r, s, a, c, l, u) {
		o.precision,
		o.samplesPerLine,
		o.scanLines;
		var h = o.mcusPerLine
		  , _ = o.progressive
		  , $ = (o.maxH,
		o.maxV,
		n)
		  , f = 0
		  , p = 0;
		function d() {
			if (p > 0)
				return p--,
				f >> p & 1;
			if (255 === (f = e[n++])) {
				var t = e[n++];
				if (t)
					throw "unexpected marker: " + (f << 8 | t).toString(16)
			}
			return p = 7,
			f >>> 7
		}
		function g(t) {
			for (var e = t; ; ) {
				if ("number" == typeof (e = e[d()]))
					return e;
				if ("object" != typeof e)
					throw "invalid huffman sequence"
			}
		}
		function y(t) {
			for (var e = 0; t > 0; )
				e = e << 1 | d(),
				t--;
			return e
		}
		function b(t) {
			if (1 === t)
				return 1 === d() ? 1 : -1;
			var e = y(t);
			return e >= 1 << t - 1 ? e : e + (-1 << t) + 1
		}
		var m = 0;
		var A, O = 0;
		function T(t, e, n, o, r) {
			var s = n % h;
			e(t, i(t, (n / h | 0) * t.v + o, s * t.h + r))
		}
		function S(t, e, n) {
			e(t, i(t, n / t.blocksPerLine | 0, n % t.blocksPerLine))
		}
		var I, E, x, v, D, N, C = r.length;
		N = _ ? 0 === a ? 0 === l ? function(t, e) {
			var n = g(t.huffmanTableDC)
			  , i = 0 === n ? 0 : b(n) << u;
			t.blockData[e] = t.pred += i
		}
		: function(t, e) {
			t.blockData[e] |= d() << u
		}
		: 0 === l ? function(e, n) {
			if (m > 0)
				m--;
			else
				for (var i = a, o = c; i <= o; ) {
					var r = g(e.huffmanTableAC)
					  , s = 15 & r
					  , l = r >> 4;
					if (0 !== s) {
						var h = t[i += l];
						e.blockData[n + h] = b(s) * (1 << u),
						i++
					} else {
						if (l < 15) {
							m = y(l) + (1 << l) - 1;
							break
						}
						i += 16
					}
				}
		}
		: function(e, n) {
			for (var i, o, r = a, s = c, l = 0; r <= s; ) {
				var h = t[r];
				switch (O) {
				case 0:
					if (l = (o = g(e.huffmanTableAC)) >> 4,
					0 === (i = 15 & o))
						l < 15 ? (m = y(l) + (1 << l),
						O = 4) : (l = 16,
						O = 1);
					else {
						if (1 !== i)
							throw "invalid ACn encoding";
						A = b(i),
						O = l ? 2 : 3
					}
					continue;
				case 1:
				case 2:
					e.blockData[n + h] ? e.blockData[n + h] += d() << u : 0 === --l && (O = 2 === O ? 3 : 0);
					break;
				case 3:
					e.blockData[n + h] ? e.blockData[n + h] += d() << u : (e.blockData[n + h] = A << u,
					O = 0);
					break;
				case 4:
					e.blockData[n + h] && (e.blockData[n + h] += d() << u)
				}
				r++
			}
			4 === O && 0 === --m && (O = 0)
		}
		: function(e, n) {
			var i = g(e.huffmanTableDC)
			  , o = 0 === i ? 0 : b(i);
			e.blockData[n] = e.pred += o;
			for (var r = 1; r < 64; ) {
				var s = g(e.huffmanTableAC)
				  , a = 15 & s
				  , c = s >> 4;
				if (0 !== a) {
					var l = t[r += c];
					e.blockData[n + l] = b(a),
					r++
				} else {
					if (c < 15)
						break;
					r += 16
				}
			}
		}
		;
		var w, k, P, M, R = 0;
		for (k = 1 === C ? r[0].blocksPerLine * r[0].blocksPerColumn : h * o.mcusPerColumn,
		s || (s = k); R < k; ) {
			for (E = 0; E < C; E++)
				r[E].pred = 0;
			if (m = 0,
			1 === C)
				for (I = r[0],
				D = 0; D < s; D++)
					S(I, N, R),
					R++;
			else
				for (D = 0; D < s; D++) {
					for (E = 0; E < C; E++)
						for (P = (I = r[E]).h,
						M = I.v,
						x = 0; x < M; x++)
							for (v = 0; v < P; v++)
								T(I, N, R, x, v);
					R++
				}
			if (p = 0,
			(w = e[n] << 8 | e[n + 1]) <= 65280)
				throw "marker was not found";
			if (!(w >= 65488 && w <= 65495))
				break;
			n += 2
		}
		return n - $
	}
	function r(t, e, n) {
		var i, o, r, s, a, c, l, u, h, _, $, f, p, d, g, y, b, m = t.quantizationTable, A = t.blockData;
		for (let t = 0; t < 64; t += 8)
			h = A[e + t],
			_ = A[e + t + 1],
			$ = A[e + t + 2],
			f = A[e + t + 3],
			p = A[e + t + 4],
			d = A[e + t + 5],
			g = A[e + t + 6],
			y = A[e + t + 7],
			h *= m[t],
			0 != (_ | $ | f | p | d | g | y) ? (_ *= m[t + 1],
			$ *= m[t + 2],
			f *= m[t + 3],
			p *= m[t + 4],
			d *= m[t + 5],
			o = (i = (i = 5793 * h + 128 >> 8) + (o = 5793 * p + 128 >> 8) + 1 >> 1) - o,
			b = 3784 * (r = $) + 1567 * (s = g *= m[t + 6]) + 128 >> 8,
			r = 1567 * r - 3784 * s + 128 >> 8,
			l = (a = (a = 2896 * (_ - (y *= m[t + 7])) + 128 >> 8) + (l = d << 4) + 1 >> 1) - l,
			c = (u = (u = 2896 * (_ + y) + 128 >> 8) + (c = f << 4) + 1 >> 1) - c,
			s = (i = i + (s = b) + 1 >> 1) - s,
			r = (o = o + r + 1 >> 1) - r,
			b = 2276 * a + 3406 * u + 2048 >> 12,
			a = 3406 * a - 2276 * u + 2048 >> 12,
			u = b,
			b = 799 * c + 4017 * l + 2048 >> 12,
			c = 4017 * c - 799 * l + 2048 >> 12,
			l = b,
			n[t] = i + u,
			n[t + 7] = i - u,
			n[t + 1] = o + l,
			n[t + 6] = o - l,
			n[t + 2] = r + c,
			n[t + 5] = r - c,
			n[t + 3] = s + a,
			n[t + 4] = s - a) : (b = 5793 * h + 512 >> 10,
			n[t] = b,
			n[t + 1] = b,
			n[t + 2] = b,
			n[t + 3] = b,
			n[t + 4] = b,
			n[t + 5] = b,
			n[t + 6] = b,
			n[t + 7] = b);
		for (var O = 0; O < 8; ++O)
			h = n[O],
			0 != ((_ = n[O + 8]) | ($ = n[O + 16]) | (f = n[O + 24]) | (p = n[O + 32]) | (d = n[O + 40]) | (g = n[O + 48]) | (y = n[O + 56])) ? (o = (i = 4112 + ((i = 5793 * h + 2048 >> 12) + (o = 5793 * p + 2048 >> 12) + 1 >> 1)) - o,
			b = 3784 * (r = $) + 1567 * (s = g) + 2048 >> 12,
			r = 1567 * r - 3784 * s + 2048 >> 12,
			s = b,
			l = (a = (a = 2896 * (_ - y) + 2048 >> 12) + (l = d) + 1 >> 1) - l,
			c = (u = (u = 2896 * (_ + y) + 2048 >> 12) + (c = f) + 1 >> 1) - c,
			b = 2276 * a + 3406 * u + 2048 >> 12,
			a = 3406 * a - 2276 * u + 2048 >> 12,
			u = b,
			b = 799 * c + 4017 * l + 2048 >> 12,
			c = 4017 * c - 799 * l + 2048 >> 12,
			h = (h = (i = i + s + 1 >> 1) + u) < 16 ? 0 : h >= 4080 ? 255 : h >> 4,
			_ = (_ = (o = o + r + 1 >> 1) + (l = b)) < 16 ? 0 : _ >= 4080 ? 255 : _ >> 4,
			$ = ($ = (r = o - r) + c) < 16 ? 0 : $ >= 4080 ? 255 : $ >> 4,
			f = (f = (s = i - s) + a) < 16 ? 0 : f >= 4080 ? 255 : f >> 4,
			p = (p = s - a) < 16 ? 0 : p >= 4080 ? 255 : p >> 4,
			d = (d = r - c) < 16 ? 0 : d >= 4080 ? 255 : d >> 4,
			g = (g = o - l) < 16 ? 0 : g >= 4080 ? 255 : g >> 4,
			y = (y = i - u) < 16 ? 0 : y >= 4080 ? 255 : y >> 4,
			A[e + O] = h,
			A[e + O + 8] = _,
			A[e + O + 16] = $,
			A[e + O + 24] = f,
			A[e + O + 32] = p,
			A[e + O + 40] = d,
			A[e + O + 48] = g,
			A[e + O + 56] = y) : (b = (b = 5793 * h + 8192 >> 14) < -2040 ? 0 : b >= 2024 ? 255 : b + 2056 >> 4,
			A[e + O] = b,
			A[e + O + 8] = b,
			A[e + O + 16] = b,
			A[e + O + 24] = b,
			A[e + O + 32] = b,
			A[e + O + 40] = b,
			A[e + O + 48] = b,
			A[e + O + 56] = b)
	}
	function s(t, e) {
		const n = e.blocksPerLine
		  , o = e.blocksPerColumn
		  , s = new Int16Array(64);
		for (let t = 0; t < o; t++)
			for (let o = 0; o < n; o++) {
				r(e, i(e, t, o), s)
			}
		return e.blockData
	}
	function a(t) {
		return t <= 0 ? 0 : t >= 255 ? 255 : t
	}
	return e.prototype = {
		parse: function(e) {
			function i() {
				var t = e[u] << 8 | e[u + 1];
				return u += 2,
				t
			}
			function r() {
				var t = i()
				  , n = e.subarray(u, u + t - 2);
				return u += n.length,
				n
			}
			function a(t) {
				for (var e = Math.ceil(t.samplesPerLine / 8 / t.maxH), n = Math.ceil(t.scanLines / 8 / t.maxV), i = 0; i < t.components.length; i++) {
					R = t.components[i];
					var o = Math.ceil(Math.ceil(t.samplesPerLine / 8) * R.h / t.maxH)
					  , r = Math.ceil(Math.ceil(t.scanLines / 8) * R.v / t.maxV)
					  , s = e * R.h
					  , a = 64 * (n * R.v) * (s + 1);
					R.blockData = new Int16Array(a),
					R.blocksPerLine = o,
					R.blocksPerColumn = r
				}
				t.mcusPerLine = e,
				t.mcusPerColumn = n
			}
			var c, l, u = 0, h = (e.length,
			null), _ = null, $ = [], f = [], p = [], d = i();
			if (65496 !== d)
				throw "SOI not found";
			for (d = i(); 65497 !== d; ) {
				var g, y, b;
				switch (d) {
				case 65504:
				case 65505:
				case 65506:
				case 65507:
				case 65508:
				case 65509:
				case 65510:
				case 65511:
				case 65512:
				case 65513:
				case 65514:
				case 65515:
				case 65516:
				case 65517:
				case 65518:
				case 65519:
				case 65534:
					var m = r();
					65504 === d && 74 === m[0] && 70 === m[1] && 73 === m[2] && 70 === m[3] && 0 === m[4] && (h = {
						version: {
							major: m[5],
							minor: m[6]
						},
						densityUnits: m[7],
						xDensity: m[8] << 8 | m[9],
						yDensity: m[10] << 8 | m[11],
						thumbWidth: m[12],
						thumbHeight: m[13],
						thumbData: m.subarray(14, 14 + 3 * m[12] * m[13])
					}),
					65518 === d && 65 === m[0] && 100 === m[1] && 111 === m[2] && 98 === m[3] && 101 === m[4] && 0 === m[5] && (_ = {
						version: m[6],
						flags0: m[7] << 8 | m[8],
						flags1: m[9] << 8 | m[10],
						transformCode: m[11]
					});
					break;
				case 65499:
					for (var A = i() + u - 2; u < A; ) {
						var O = e[u++]
						  , T = new Uint16Array(64);
						if (O >> 4 == 0)
							for (y = 0; y < 64; y++)
								T[t[y]] = e[u++];
						else {
							if (O >> 4 != 1)
								throw "DQT: invalid table spec";
							for (y = 0; y < 64; y++)
								T[t[y]] = i()
						}
						$[15 & O] = T
					}
					break;
				case 65472:
				case 65473:
				case 65474:
					if (c)
						throw "Only single frame JPEGs supported";
					i(),
					(c = {}).extended = 65473 === d,
					c.progressive = 65474 === d,
					c.precision = e[u++],
					c.scanLines = i(),
					c.samplesPerLine = i(),
					c.components = [],
					c.componentIds = {};
					var S, I = e[u++], E = 0, x = 0;
					for (g = 0; g < I; g++) {
						S = e[u];
						var v = e[u + 1] >> 4
						  , D = 15 & e[u + 1];
						E < v && (E = v),
						x < D && (x = D);
						var N = e[u + 2];
						b = c.components.push({
							h: v,
							v: D,
							quantizationTable: $[N]
						}),
						c.componentIds[S] = b - 1,
						u += 3
					}
					c.maxH = E,
					c.maxV = x,
					a(c);
					break;
				case 65476:
					var C = i();
					for (g = 2; g < C; ) {
						var w = e[u++]
						  , k = new Uint8Array(16)
						  , P = 0;
						for (y = 0; y < 16; y++,
						u++)
							P += k[y] = e[u];
						var M = new Uint8Array(P);
						for (y = 0; y < P; y++,
						u++)
							M[y] = e[u];
						g += 17 + P,
						(w >> 4 == 0 ? p : f)[15 & w] = n(k, M)
					}
					break;
				case 65501:
					i(),
					l = i();
					break;
				case 65498:
					i();
					var R, L = e[u++], U = [];
					for (g = 0; g < L; g++) {
						var B = c.componentIds[e[u++]];
						R = c.components[B];
						var F = e[u++];
						R.huffmanTableDC = p[F >> 4],
						R.huffmanTableAC = f[15 & F],
						U.push(R)
					}
					var j = e[u++]
					  , z = e[u++]
					  , V = e[u++]
					  , Y = o(e, u, c, U, l, j, z, V >> 4, 15 & V);
					u += Y;
					break;
				case 65535:
					255 !== e[u] && u--;
					break;
				default:
					if (255 === e[u - 3] && e[u - 2] >= 192 && e[u - 2] <= 254) {
						u -= 3;
						break
					}
					throw "unknown JPEG marker " + d.toString(16)
				}
				d = i()
			}
			for (this.width = c.samplesPerLine,
			this.height = c.scanLines,
			this.jfif = h,
			this.adobe = _,
			this.components = [],
			g = 0; g < c.components.length; g++)
				R = c.components[g],
				this.components.push({
					output: s(0, R),
					scaleX: R.h / c.maxH,
					scaleY: R.v / c.maxV,
					blocksPerLine: R.blocksPerLine,
					blocksPerColumn: R.blocksPerColumn
				});
			this.numComponents = this.components.length
		},
		_getLinearizedBlockData: function(t, e) {
			var n, i, o, r, s, a, c, l, u, h, _, $ = this.width / t, f = this.height / e, p = 0, d = this.components.length, g = t * e * d, y = new Uint8Array(g), b = new Uint32Array(t);
			for (c = 0; c < d; c++) {
				for (i = (n = this.components[c]).scaleX * $,
				o = n.scaleY * f,
				p = c,
				_ = n.output,
				r = n.blocksPerLine + 1 << 3,
				s = 0; s < t; s++)
					l = 0 | s * i,
					b[s] = (4294967288 & l) << 3 | 7 & l;
				for (a = 0; a < e; a++)
					for (h = r * (4294967288 & (l = 0 | a * o)) | (7 & l) << 3,
					s = 0; s < t; s++)
						y[p] = _[h + b[s]],
						p += d
			}
			var m = this.decodeTransform;
			if (m)
				for (c = 0; c < g; )
					for (l = 0,
					u = 0; l < d; l++,
					c++,
					u += 2)
						y[c] = (y[c] * m[u] >> 8) + m[u + 1];
			return y
		},
		_isColorConversionNeeded: function() {
			return !(!this.adobe || !this.adobe.transformCode) || 3 === this.numComponents
		},
		_convertYccToRgb: function(t) {
			for (var e, n, i, o = 0, r = t.length; o < r; o += 3)
				e = t[o],
				n = t[o + 1],
				i = t[o + 2],
				t[o] = a(e - 179.456 + 1.402 * i),
				t[o + 1] = a(e + 135.459 - .344 * n - .714 * i),
				t[o + 2] = a(e - 226.816 + 1.772 * n);
			return t
		},
		_convertYcckToRgb: function(t) {
			for (var e, n, i, o, r = 0, s = 0, c = t.length; s < c; s += 4) {
				e = t[s];
				var l = (n = t[s + 1]) * (-660635669420364e-19 * n + .000437130475926232 * (i = t[s + 2]) - 54080610064599e-18 * e + .00048449797120281 * (o = t[s + 3]) - .154362151871126) - 122.67195406894 + i * (-.000957964378445773 * i + .000817076911346625 * e - .00477271405408747 * o + 1.53380253221734) + e * (.000961250184130688 * e - .00266257332283933 * o + .48357088451265) + o * (-.000336197177618394 * o + .484791561490776)
				  , u = 107.268039397724 + n * (219927104525741e-19 * n - .000640992018297945 * i + .000659397001245577 * e + .000426105652938837 * o - .176491792462875) + i * (-.000778269941513683 * i + .00130872261408275 * e + .000770482631801132 * o - .151051492775562) + e * (.00126935368114843 * e - .00265090189010898 * o + .25802910206845) + o * (-.000318913117588328 * o - .213742400323665)
				  , h = n * (-.000570115196973677 * n - 263409051004589e-19 * i + .0020741088115012 * e - .00288260236853442 * o + .814272968359295) - 20.810012546947 + i * (-153496057440975e-19 * i - .000132689043961446 * e + .000560833691242812 * o - .195152027534049) + e * (.00174418132927582 * e - .00255243321439347 * o + .116935020465145) + o * (-.000343531996510555 * o + .24165260232407);
				t[r++] = a(l),
				t[r++] = a(u),
				t[r++] = a(h)
			}
			return t
		},
		_convertYcckToCmyk: function(t) {
			for (var e, n, i, o = 0, r = t.length; o < r; o += 4)
				e = t[o],
				n = t[o + 1],
				i = t[o + 2],
				t[o] = a(434.456 - e - 1.402 * i),
				t[o + 1] = a(119.541 - e + .344 * n + .714 * i),
				t[o + 2] = a(481.816 - e - 1.772 * n);
			return t
		},
		_convertCmykToRgb: function(t) {
			for (var e, n, i, o, r = 0, s = -16581375, a = 0, c = t.length; a < c; a += 4) {
				var l = (e = t[a]) * (-4.387332384609988 * e + 54.48615194189176 * (n = t[a + 1]) + 18.82290502165302 * (i = t[a + 2]) + 212.25662451639585 * (o = t[a + 3]) - 72734.4411664936) + n * (1.7149763477362134 * n - 5.6096736904047315 * i - 17.873870861415444 * o - 1401.7366389350734) + i * (-2.5217340131683033 * i - 21.248923337353073 * o + 4465.541406466231) - o * (21.86122147463605 * o + 48317.86113160301)
				  , u = e * (8.841041422036149 * e + 60.118027045597366 * n + 6.871425592049007 * i + 31.159100130055922 * o - 20220.756542821975) + n * (-15.310361306967817 * n + 17.575251261109482 * i + 131.35250912493976 * o - 48691.05921601825) + i * (4.444339102852739 * i + 9.8632861493405 * o - 6341.191035517494) - o * (20.737325471181034 * o + 47890.15695978492)
				  , h = e * (.8842522430003296 * e + 8.078677503112928 * n + 30.89978309703729 * i - .23883238689178934 * o - 3616.812083916688) + n * (10.49593273432072 * n + 63.02378494754052 * i + 50.606957656360734 * o - 28620.90484698408) + i * (.03296041114873217 * i + 115.60384449646641 * o - 49363.43385999684) - o * (22.33816807309886 * o + 45932.16563550634);
				t[r++] = l >= 0 ? 255 : l <= s ? 0 : 255 + l * (1 / 255 / 255) | 0,
				t[r++] = u >= 0 ? 255 : u <= s ? 0 : 255 + u * (1 / 255 / 255) | 0,
				t[r++] = h >= 0 ? 255 : h <= s ? 0 : 255 + h * (1 / 255 / 255) | 0
			}
			return t
		},
		getData: function(t, e, n) {
			if (this.numComponents > 4)
				throw "Unsupported color mode";
			var i = this._getLinearizedBlockData(t, e);
			if (3 === this.numComponents)
				return this._convertYccToRgb(i);
			if (4 === this.numComponents) {
				if (this._isColorConversionNeeded())
					return n ? this._convertYcckToRgb(i) : this._convertYcckToCmyk(i);
				if (n)
					return this._convertCmykToRgb(i)
			}
			return i
		},
		copyToImageData: function(t) {
			if (2 === this.numComponents || this.numComponents > 4)
				throw new Error("Unsupported amount of components");
			var e, n, i = t.width, o = t.height, r = i * o * 4, s = t.pixels;
			if (1 !== this.numComponents) {
				var a = this.getData(i, o, !0);
				for (e = 0,
				n = 0,
				0; e < r; )
					s[e++] = a[n++],
					s[e++] = a[n++],
					s[e++] = a[n++],
					s[e++] = 255
			} else {
				var c = this.getData(i, o, !1);
				for (e = 0,
				n = 0,
				0; e < r; ) {
					var l = c[n++];
					s[e++] = l,
					s[e++] = l,
					s[e++] = l,
					s[e++] = 255
				}
			}
		}
	},
	new e
}();
var AT_MP3_Decoder = (function() {
	const BitStream = function() {
		this._end = 0;
		this.viewUint8 = null;
		this.bitPos = 0;
		this.bytePos = 0;
	}
	BitStream.prototype.readBit = function() {
		if (this._end <= this.bytePos) return 0;
		var tmp = (this.viewUint8[this.bytePos] >> (7 - (this.bitPos++)));
		if (this.bitPos > 7) {
			this.bitPos = 0;
			this.bytePos++;
		}
		return tmp & 1;
	}
	BitStream.prototype.get_bits = function(num) {
		if (num === 0) return 0;
		if (this._end <= this.bytePos) return 0;
		var value = 0;
		while (num--) {
			value <<= 1;
			value |= this.readBit();
		}
		return value;
	}
	BitStream.prototype.setData = function(vec) {
		this._end = vec.length;
		this.viewUint8 = vec;
		this.bitPos = 0;
		this.bytePos = 0;
	}
	const MP3Header = function() {
		this.h_layer = 0;
		this.h_protection_bit = 0;
		this.h_bitrate_index = 0;
		this.h_padding_bit = 0;
		this.h_mode_extension = 0;
		this.h_version = 0;
		this.h_mode = 0;
		this.h_sample_frequency = 0;
		this.h_number_of_subbands = 0;
		this.h_intensity_stereo_bound = 0;
		this.h_copyright = 0;
		this.h_original = 0;
		this.h_crc = 0;
		this.framesize = 0;
		this.nSlots = 0;
		this.checksum = 0;
	}
	MP3Header.versionTable = [2, 1, 2.5, -1];
	MP3Header.layerTable = [-1, 3, 2, 1];
	MP3Header.frequencies = [[22050, 24000, 16000], [44100, 48000, 32000], [11025, 12000, 8000]];
	MP3Header.MPEG2_LSF = 0;
	MP3Header.MPEG25_LSF = 2;
	MP3Header.MPEG1 = 1;
	MP3Header.STEREO = 0;
	MP3Header.JOINT_STEREO = 1;
	MP3Header.DUAL_CHANNEL = 2;
	MP3Header.SINGLE_CHANNEL = 3;
	MP3Header.FOURTYFOUR_POINT_ONE = 0;
	MP3Header.FOURTYEIGHT = 1;
	MP3Header.THIRTYTWO = 2;
	MP3Header.bitrates = [[[0, 32000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 144000, 160000, 176000, 192000, 224000, 256000, 0], [0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 144000, 160000, 0], [0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 144000, 160000, 0]], [[0, 32000, 64000, 96000, 128000, 160000, 192000, 224000, 256000, 288000, 320000, 352000, 384000, 416000, 448000, 0], [0, 32000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 160000, 192000, 224000, 256000, 320000, 384000, 0], [0, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 160000, 192000, 224000, 256000, 320000, 0]], [[0, 32000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 144000, 160000, 176000, 192000, 224000, 256000, 0], [0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 144000, 160000, 0], [0, 8000, 16000, 24000, 32000, 40000, 48000, 56000, 64000, 80000, 96000, 112000, 128000, 144000, 160000, 0]]];
	MP3Header.prototype.parseHeader = function(header) {
		this.h_crc = ((header & 0x00010000) >>> 16) >>> 0;
		var channelBitrate = 0;
		this.h_sample_frequency = ((header >>> 10) & 3);
		this.h_version = ((header >>> 19) & 1);
		if (((header >>> 20) & 1) == 0)
			if (this.h_version == MP3Header.MPEG2_LSF)
				this.h_version = MP3Header.MPEG25_LSF;
			else
				throw new Error("UNKNOWN_ERROR");
		this.h_layer = 4 - (header >>> 17) & 3;
		this.h_protection_bit = (header >>> 16) & 1;
		this.h_bitrate_index = (header >>> 12) & 0xF;
		this.h_padding_bit = (header >>> 9) & 1;
		this.h_mode = ((header >>> 6) & 3);
		this.h_mode_extension = (header >>> 4) & 3;
		if (this.h_mode == MP3Header.JOINT_STEREO)
			this.h_intensity_stereo_bound = (this.h_mode_extension << 2) + 4;
		else
			this.h_intensity_stereo_bound = 0; // should never be used
		if (((header >>> 3) & 1) == 1)
			this.h_copyright = true;
		if (((header >>> 2) & 1) == 1)
			this.h_original = true;
		if (this.h_layer == 1)
			this.h_number_of_subbands = 32;
		else {
			channelBitrate = this.h_bitrate_index;
			// calculate bitrate per channel:
			if (this.h_mode != MP3Header.SINGLE_CHANNEL)
				if (channelBitrate == 4)
					channelBitrate = 1;
				else
					channelBitrate -= 4;
			if ((channelBitrate == 1) || (channelBitrate == 2))
				if (this.h_sample_frequency == MP3Header.THIRTYTWO)
					this.h_number_of_subbands = 12;
				else
					this.h_number_of_subbands = 8;
			else if ((this.h_sample_frequency == MP3Header.FOURTYEIGHT) || ((channelBitrate >= 3) && (channelBitrate <= 5)))
				this.h_number_of_subbands = 27;
			else
				this.h_number_of_subbands = 30;
		}
		if (this.h_intensity_stereo_bound > this.h_number_of_subbands)
			this.h_intensity_stereo_bound = this.h_number_of_subbands;
		this.calculate_framesize();
	}
	MP3Header.prototype.frequency = function() {
		return MP3Header.frequencies[this.h_version][this.h_sample_frequency];
	}
	MP3Header.prototype.sample_frequency = function() {
		return this.h_sample_frequency;
	}
	MP3Header.prototype.version = function() {
		return this.h_version;
	}
	MP3Header.prototype.layer = function() {
		return this.h_layer;
	}
	MP3Header.prototype.mode = function() {
		return this.h_mode;
	}
	MP3Header.prototype.checksums = function() {
		return this.h_protection_bit == 0;
	}
	MP3Header.prototype.copyright = function() {
		return this.h_copyright;
	}
	MP3Header.prototype.crc = function() {
		return this.h_crc;
	}
	MP3Header.prototype.original = function() {
		return this.h_original;
	}
	MP3Header.prototype.padding = function() {
		return this.h_padding_bit != 0;
	}
	MP3Header.prototype.slots = function() {
		return this.nSlots;
	}
	MP3Header.prototype.mode_extension = function() {
		return this.h_mode_extension;
	}
	MP3Header.prototype.calculate_framesize = function() {
		if (this.h_layer == 1) {
			this.framesize = ((12 * MP3Header.bitrates[this.h_version][0][this.h_bitrate_index]) / MP3Header.frequencies[this.h_version][this.h_sample_frequency]) | 0;
			if (this.h_padding_bit != 0) this.framesize++;
			this.framesize <<= 2;
			this.nSlots = 0;
		} else {
			this.framesize = ((144 * MP3Header.bitrates[this.h_version][this.h_layer - 1][this.h_bitrate_index]) / MP3Header.frequencies[this.h_version][this.h_sample_frequency]) | 0;
			if (this.h_version == MP3Header.MPEG2_LSF || this.h_version == MP3Header.MPEG25_LSF) this.framesize >>= 1;
			if (this.h_padding_bit != 0) this.framesize++;
			if (this.h_layer == 3) {
				if (this.h_version == MP3Header.MPEG1) {
					this.nSlots = this.framesize - ((this.h_mode == MP3Header.SINGLE_CHANNEL) ? 17 : 32) - ((this.h_protection_bit != 0) ? 0 : 2) - 4; 
				} else {
					this.nSlots = this.framesize - ((this.h_mode == MP3Header.SINGLE_CHANNEL) ? 9 : 17) - ((this.h_protection_bit != 0) ? 0 : 2) - 4;
				}
			} else {
				this.nSlots = 0;
			}
		}
		this.framesize -= 4;
		return this.framesize;
	}
	MP3Header.prototype.layer_string = function() {
		switch (this.h_layer) {
			case 1:
				return "I";
			case 2:
				return "II";
			case 3:
				return "III";
		}
		return null;
	}
	MP3Header.bitrate_str = [[["free format", "32 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "144 kbit/s", "160 kbit/s", "176 kbit/s", "192 kbit/s", "224 kbit/s", "256 kbit/s", "forbidden"], ["free format", "8 kbit/s", "16 kbit/s", "24 kbit/s", "32 kbit/s", "40 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "144 kbit/s", "160 kbit/s", "forbidden"], ["free format", "8 kbit/s", "16 kbit/s", "24 kbit/s", "32 kbit/s", "40 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "144 kbit/s", "160 kbit/s", "forbidden"]], [["free format", "32 kbit/s", "64 kbit/s", "96 kbit/s", "128 kbit/s", "160 kbit/s", "192 kbit/s", "224 kbit/s", "256 kbit/s", "288 kbit/s", "320 kbit/s", "352 kbit/s", "384 kbit/s", "416 kbit/s", "448 kbit/s", "forbidden"], ["free format", "32 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "160 kbit/s", "192 kbit/s", "224 kbit/s", "256 kbit/s", "320 kbit/s", "384 kbit/s", "forbidden"], ["free format", "32 kbit/s", "40 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "160 kbit/s", "192 kbit/s", "224 kbit/s", "256 kbit/s", "320 kbit/s", "forbidden"]], [["free format", "32 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "144 kbit/s", "160 kbit/s", "176 kbit/s", "192 kbit/s", "224 kbit/s", "256 kbit/s", "forbidden"], ["free format", "8 kbit/s", "16 kbit/s", "24 kbit/s", "32 kbit/s", "40 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "144 kbit/s", "160 kbit/s", "forbidden"], ["free format", "8 kbit/s", "16 kbit/s", "24 kbit/s", "32 kbit/s", "40 kbit/s", "48 kbit/s", "56 kbit/s", "64 kbit/s", "80 kbit/s", "96 kbit/s", "112 kbit/s", "128 kbit/s", "144 kbit/s", "160 kbit/s", "forbidden"]]];
	MP3Header.prototype.bitrate_string = function() {
		return MP3Header.bitrate_str[this.h_version][this.h_layer - 1][this.h_bitrate_index];
	}
	MP3Header.prototype.sample_frequency_string = function() {
		switch (this.h_sample_frequency) {
			case MP3Header.THIRTYTWO:
				if (this.h_version == MP3Header.MPEG1)
					return "32 kHz";
				else if (this.h_version == MP3Header.MPEG2_LSF)
					return "16 kHz";
				else    // SZD
					return "8 kHz";
			case MP3Header.FOURTYFOUR_POINT_ONE:
				if (this.h_version == MP3Header.MPEG1)
					return "44.1 kHz";
				else if (this.h_version == MP3Header.MPEG2_LSF)
					return "22.05 kHz";
				else    // SZD
					return "11.025 kHz";
			case MP3Header.FOURTYEIGHT:
				if (this.h_version == MP3Header.MPEG1)
					return "48 kHz";
				else if (this.h_version == MP3Header.MPEG2_LSF)
					return "24 kHz";
				else    // SZD
					return "12 kHz";
		}
		return null;
	}
	MP3Header.isValidHeader = function(h) {
		return (((h >>> 24) == 0xFF) && (((h >> 21) & 2047) == 2047) && ((((h & 0x00180000) >>> 19) >>> 0) != 1) && ((((h & 0x00060000) >>> 17) >>> 0) != 0) && ((((h & 0x0000f000) >>> 12) >>> 0) != 0) && ((((h & 0x0000f000) >>> 12) >>> 0) != 15) && ((((h & 0x00000c00) >>> 10) >>> 0) != 3) && (((h & 0x00000003) >>> 0) != 2));
	}
	const BitReserve = function() {
		this.offset = 0;
		this.totbit = 0;
		this.buf_byte_idx = 0;
		this.buf = new Int32Array(BitReserve.BUFSIZE);
	}
	BitReserve.BUFSIZE = 4096 * 8;
	BitReserve.BUFSIZE_MASK = BitReserve.BUFSIZE - 1;
	BitReserve.prototype.hputbuf = function(val) {
		var ofs = this.offset;
		this.buf[ofs++] = val & 0x80;
		this.buf[ofs++] = val & 0x40;
		this.buf[ofs++] = val & 0x20;
		this.buf[ofs++] = val & 0x10;
		this.buf[ofs++] = val & 0x08;
		this.buf[ofs++] = val & 0x04;
		this.buf[ofs++] = val & 0x02;
		this.buf[ofs++] = val & 0x01;
		if (ofs == BitReserve.BUFSIZE) this.offset = 0;
		else this.offset = ofs;
	}
	BitReserve.prototype.hsstell = function() {
		return this.totbit;
	}
	BitReserve.prototype.hgetbits = function(N) {
		this.totbit += N;
		var val = 0;
		var pos = this.buf_byte_idx;
		if (pos + N < BitReserve.BUFSIZE) {
			while (N-- > 0) {
				val <<= 1;
				val |= ((this.buf[pos++] != 0) ? 1 : 0);
			}
		} else {
			while (N-- > 0) {
				val <<= 1;
				val |= ((this.buf[pos] != 0) ? 1 : 0);
				pos = (pos + 1) & BitReserve.BUFSIZE_MASK;
			}
		}
		this.buf_byte_idx = pos;
		return val;
	}
	BitReserve.prototype.hget1bit = function() {
		this.totbit++;
		var val = this.buf[this.buf_byte_idx];
		this.buf_byte_idx = (this.buf_byte_idx + 1) & BitReserve.BUFSIZE_MASK;
		return val;
	}
	BitReserve.prototype.rewindNbits = function(N) {
		this.totbit -= N;
		this.buf_byte_idx -= N;
		if (this.buf_byte_idx < 0)
			this.buf_byte_idx += BitReserve.BUFSIZE;
	}
	BitReserve.prototype.rewindNbytes = function(N) {
		var bits = (N << 3);
		this.totbit -= bits;
		this.buf_byte_idx -= bits;
		if (this.buf_byte_idx < 0)
			this.buf_byte_idx += BitReserve.BUFSIZE;
	}
	const huffcodetab = function(S, XLEN, YLEN, LINBITS, LINMAX, REF, VAL, TREELEN) {
		this.tablename0 = S.charAt(0);
		this.tablename1 = S.charAt(1);
		this.tablename2 = S.charAt(2);
		this.xlen = XLEN;
		this.ylen = YLEN;
		this.linbits = LINBITS;
		this.linmax = LINMAX;
		this.ref = REF;
		this.val = VAL;
		this.treelen = TREELEN;
	}
	huffcodetab.MXOFF = 250;
	huffcodetab.ValTab0 = [[0, 0]];
	huffcodetab.ValTab1 = [[2, 1], [0, 0], [2, 1], [0, 16], [2, 1], [0, 1], [0, 17]];
	huffcodetab.ValTab2 = [[2, 1], [0, 0], [4, 1], [2, 1], [0, 16], [0, 1], [2, 1], [0, 17], [4, 1], [2, 1], [0, 32], [0, 33], [2, 1], [0, 18], [2, 1], [0, 2], [0, 34]];
	huffcodetab.ValTab3 = [[4, 1], [2, 1], [0, 0], [0, 1], [2, 1], [0, 17], [2, 1], [0, 16], [4, 1], [2, 1], [0, 32], [0, 33], [2, 1], [0, 18], [2, 1], [0, 2], [0, 34]];
	huffcodetab.ValTab4 = [[0, 0]];
	huffcodetab.ValTab5 = [[2, 1], [0, 0], [4, 1], [2, 1], [0, 16], [0, 1], [2, 1], [0, 17], [8, 1], [4, 1], [2, 1], [0, 32], [0, 2], [2, 1], [0, 33], [0, 18], [8, 1], [4, 1], [2, 1], [0, 34], [0, 48], [2, 1], [0, 3], [0, 19], [2, 1], [0, 49], [2, 1], [0, 50], [2, 1], [0, 35], [0, 51]];
	huffcodetab.ValTab6 = [[6, 1], [4, 1], [2, 1], [0, 0], [0, 16], [0, 17], [6, 1], [2, 1], [0, 1], [2, 1], [0, 32], [0, 33], [6, 1], [2, 1], [0, 18], [2, 1], [0, 2], [0, 34], [4, 1], [2, 1], [0, 49], [0, 19], [4, 1], [2, 1], [0, 48], [0, 50], [2, 1], [0, 35], [2, 1], [0, 3], [0, 51]];
	huffcodetab.ValTab7 = [[2, 1], [0, 0], [4, 1], [2, 1], [0, 16], [0, 1], [8, 1], [2, 1], [0, 17], [4, 1], [2, 1], [0, 32], [0, 2], [0, 33], [18, 1], [6, 1], [2, 1], [0, 18], [2, 1], [0, 34], [0, 48], [4, 1], [2, 1], [0, 49], [0, 19], [4, 1], [2, 1], [0, 3], [0, 50], [2, 1], [0, 35], [0, 4], [10, 1], [4, 1], [2, 1], [0, 64], [0, 65], [2, 1], [0, 20], [2, 1], [0, 66], [0, 36], [12, 1], [6, 1], [4, 1], [2, 1], [0, 51], [0, 67], [0, 80], [4, 1], [2, 1], [0, 52], [0, 5], [0, 81], [6, 1], [2, 1], [0, 21], [2, 1], [0, 82], [0, 37], [4, 1], [2, 1], [0, 68], [0, 53], [4, 1], [2, 1], [0, 83], [0, 84], [2, 1], [0, 69], [0, 85]];
	huffcodetab.ValTab8 = [[6, 1], [2, 1], [0, 0], [2, 1], [0, 16], [0, 1], [2, 1], [0, 17], [4, 1], [2, 1], [0, 33], [0, 18], [14, 1], [4, 1], [2, 1], [0, 32], [0, 2], [2, 1], [0, 34], [4, 1], [2, 1], [0, 48], [0, 3], [2, 1], [0, 49], [0, 19], [14, 1], [8, 1], [4, 1], [2, 1], [0, 50], [0, 35], [2, 1], [0, 64], [0, 4], [2, 1], [0, 65], [2, 1], [0, 20], [0, 66], [12, 1], [6, 1], [2, 1], [0, 36], [2, 1], [0, 51], [0, 80], [4, 1], [2, 1], [0, 67], [0, 52], [0, 81], [6, 1], [2, 1], [0, 21], [2, 1], [0, 5], [0, 82], [6, 1], [2, 1], [0, 37], [2, 1], [0, 68], [0, 53], [2, 1], [0, 83], [2, 1], [0, 69], [2, 1], [0, 84], [0, 85]];
	huffcodetab.ValTab9 = [[8, 1], [4, 1], [2, 1], [0, 0], [0, 16], [2, 1], [0, 1], [0, 17], [10, 1], [4, 1], [2, 1], [0, 32], [0, 33], [2, 1], [0, 18], [2, 1], [0, 2], [0, 34], [12, 1], [6, 1], [4, 1], [2, 1], [0, 48], [0, 3], [0, 49], [2, 1], [0, 19], [2, 1], [0, 50], [0, 35], [12, 1], [4, 1], [2, 1], [0, 65], [0, 20], [4, 1], [2, 1], [0, 64], [0, 51], [2, 1], [0, 66], [0, 36], [10, 1], [6, 1], [4, 1], [2, 1], [0, 4], [0, 80], [0, 67], [2, 1], [0, 52], [0, 81], [8, 1], [4, 1], [2, 1], [0, 21], [0, 82], [2, 1], [0, 37], [0, 68], [6, 1], [4, 1], [2, 1], [0, 5], [0, 84], [0, 83], [2, 1], [0, 53], [2, 1], [0, 69], [0, 85]];
	huffcodetab.ValTab10 = [[2, 1], [0, 0], [4, 1], [2, 1], [0, 16], [0, 1], [10, 1], [2, 1], [0, 17], [4, 1], [2, 1], [0, 32], [0, 2], [2, 1], [0, 33], [0, 18], [28, 1], [8, 1], [4, 1], [2, 1], [0, 34], [0, 48], [2, 1], [0, 49], [0, 19], [8, 1], [4, 1], [2, 1], [0, 3], [0, 50], [2, 1], [0, 35], [0, 64], [4, 1], [2, 1], [0, 65], [0, 20], [4, 1], [2, 1], [0, 4], [0, 51], [2, 1], [0, 66], [0, 36], [28, 1], [10, 1], [6, 1], [4, 1], [2, 1], [0, 80], [0, 5], [0, 96], [2, 1], [0, 97], [0, 22], [12, 1], [6, 1], [4, 1], [2, 1], [0, 67], [0, 52], [0, 81], [2, 1], [0, 21], [2, 1], [0, 82], [0, 37], [4, 1], [2, 1], [0, 38], [0, 54], [0, 113], [20, 1], [8, 1], [2, 1], [0, 23], [4, 1], [2, 1], [0, 68], [0, 83], [0, 6], [6, 1], [4, 1], [2, 1], [0, 53], [0, 69], [0, 98], [2, 1], [0, 112], [2, 1], [0, 7], [0, 100], [14, 1], [4, 1], [2, 1], [0, 114], [0, 39], [6, 1], [2, 1], [0, 99], [2, 1], [0, 84], [0, 85], [2, 1], [0, 70], [0, 115], [8, 1], [4, 1], [2, 1], [0, 55], [0, 101], [2, 1], [0, 86], [0, 116], [6, 1], [2, 1], [0, 71], [2, 1], [0, 102], [0, 117], [4, 1], [2, 1], [0, 87], [0, 118], [2, 1], [0, 103], [0, 119]];
	huffcodetab.ValTab11 = [[6, 1], [2, 1], [0, 0], [2, 1], [0, 16], [0, 1], [8, 1], [2, 1], [0, 17], [4, 1], [2, 1], [0, 32], [0, 2], [0, 18], [24, 1], [8, 1], [2, 1], [0, 33], [2, 1], [0, 34], [2, 1], [0, 48], [0, 3], [4, 1], [2, 1], [0, 49], [0, 19], [4, 1], [2, 1], [0, 50], [0, 35], [4, 1], [2, 1], [0, 64], [0, 4], [2, 1], [0, 65], [0, 20], [30, 1], [16, 1], [10, 1], [4, 1], [2, 1], [0, 66], [0, 36], [4, 1], [2, 1], [0, 51], [0, 67], [0, 80], [4, 1], [2, 1], [0, 52], [0, 81], [0, 97], [6, 1], [2, 1], [0, 22], [2, 1], [0, 6], [0, 38], [2, 1], [0, 98], [2, 1], [0, 21], [2, 1], [0, 5], [0, 82], [16, 1], [10, 1], [6, 1], [4, 1], [2, 1], [0, 37], [0, 68], [0, 96], [2, 1], [0, 99], [0, 54], [4, 1], [2, 1], [0, 112], [0, 23], [0, 113], [16, 1], [6, 1], [4, 1], [2, 1], [0, 7], [0, 100], [0, 114], [2, 1], [0, 39], [4, 1], [2, 1], [0, 83], [0, 53], [2, 1], [0, 84], [0, 69], [10, 1], [4, 1], [2, 1], [0, 70], [0, 115], [2, 1], [0, 55], [2, 1], [0, 101], [0, 86], [10, 1], [6, 1], [4, 1], [2, 1], [0, 85], [0, 87], [0, 116], [2, 1], [0, 71], [0, 102], [4, 1], [2, 1], [0, 117], [0, 118], [2, 1], [0, 103], [0, 119]];
	huffcodetab.ValTab12 = [[12, 1], [4, 1], [2, 1], [0, 16], [0, 1], [2, 1], [0, 17], [2, 1], [0, 0], [2, 1], [0, 32], [0, 2], [16, 1], [4, 1], [2, 1], [0, 33], [0, 18], [4, 1], [2, 1], [0, 34], [0, 49], [2, 1], [0, 19], [2, 1], [0, 48], [2, 1], [0, 3], [0, 64], [26, 1], [8, 1], [4, 1], [2, 1], [0, 50], [0, 35], [2, 1], [0, 65], [0, 51], [10, 1], [4, 1], [2, 1], [0, 20], [0, 66], [2, 1], [0, 36], [2, 1], [0, 4], [0, 80], [4, 1], [2, 1], [0, 67], [0, 52], [2, 1], [0, 81], [0, 21], [28, 1], [14, 1], [8, 1], [4, 1], [2, 1], [0, 82], [0, 37], [2, 1], [0, 83], [0, 53], [4, 1], [2, 1], [0, 96], [0, 22], [0, 97], [4, 1], [2, 1], [0, 98], [0, 38], [6, 1], [4, 1], [2, 1], [0, 5], [0, 6], [0, 68], [2, 1], [0, 84], [0, 69], [18, 1], [10, 1], [4, 1], [2, 1], [0, 99], [0, 54], [4, 1], [2, 1], [0, 112], [0, 7], [0, 113], [4, 1], [2, 1], [0, 23], [0, 100], [2, 1], [0, 70], [0, 114], [10, 1], [6, 1], [2, 1], [0, 39], [2, 1], [0, 85], [0, 115], [2, 1], [0, 55], [0, 86], [8, 1], [4, 1], [2, 1], [0, 101], [0, 116], [2, 1], [0, 71], [0, 102], [4, 1], [2, 1], [0, 117], [0, 87], [2, 1], [0, 118], [2, 1], [0, 103], [0, 119]];
	huffcodetab.ValTab13 = [[2, 1], [0, 0], [6, 1], [2, 1], [0, 16], [2, 1], [0, 1], [0, 17], [28, 1], [8, 1], [4, 1], [2, 1], [0, 32], [0, 2], [2, 1], [0, 33], [0, 18], [8, 1], [4, 1], [2, 1], [0, 34], [0, 48], [2, 1], [0, 3], [0, 49], [6, 1], [2, 1], [0, 19], [2, 1], [0, 50], [0, 35], [4, 1], [2, 1], [0, 64], [0, 4], [0, 65], [70, 1], [28, 1], [14, 1], [6, 1], [2, 1], [0, 20], [2, 1], [0, 51], [0, 66], [4, 1], [2, 1], [0, 36], [0, 80], [2, 1], [0, 67], [0, 52], [4, 1], [2, 1], [0, 81], [0, 21], [4, 1], [2, 1], [0, 5], [0, 82], [2, 1], [0, 37], [2, 1], [0, 68], [0, 83], [14, 1], [8, 1], [4, 1], [2, 1], [0, 96], [0, 6], [2, 1], [0, 97], [0, 22], [4, 1], [2, 1], [0, 128], [0, 8], [0, 129], [16, 1], [8, 1], [4, 1], [2, 1], [0, 53], [0, 98], [2, 1], [0, 38], [0, 84], [4, 1], [2, 1], [0, 69], [0, 99], [2, 1], [0, 54], [0, 112], [6, 1], [4, 1], [2, 1], [0, 7], [0, 85], [0, 113], [2, 1], [0, 23], [2, 1], [0, 39], [0, 55], [72, 1], [24, 1], [12, 1], [4, 1], [2, 1], [0, 24], [0, 130], [2, 1], [0, 40], [4, 1], [2, 1], [0, 100], [0, 70], [0, 114], [8, 1], [4, 1], [2, 1], [0, 132], [0, 72], [2, 1], [0, 144], [0, 9], [2, 1], [0, 145], [0, 25], [24, 1], [14, 1], [8, 1], [4, 1], [2, 1], [0, 115], [0, 101], [2, 1], [0, 86], [0, 116], [4, 1], [2, 1], [0, 71], [0, 102], [0, 131], [6, 1], [2, 1], [0, 56], [2, 1], [0, 117], [0, 87], [2, 1], [0, 146], [0, 41], [14, 1], [8, 1], [4, 1], [2, 1], [0, 103], [0, 133], [2, 1], [0, 88], [0, 57], [2, 1], [0, 147], [2, 1], [0, 73], [0, 134], [6, 1], [2, 1], [0, 160], [2, 1], [0, 104], [0, 10], [2, 1], [0, 161], [0, 26], [68, 1], [24, 1], [12, 1], [4, 1], [2, 1], [0, 162], [0, 42], [4, 1], [2, 1], [0, 149], [0, 89], [2, 1], [0, 163], [0, 58], [8, 1], [4, 1], [2, 1], [0, 74], [0, 150], [2, 1], [0, 176], [0, 11], [2, 1], [0, 177], [0, 27], [20, 1], [8, 1], [2, 1], [0, 178], [4, 1], [2, 1], [0, 118], [0, 119], [0, 148], [6, 1], [4, 1], [2, 1], [0, 135], [0, 120], [0, 164], [4, 1], [2, 1], [0, 105], [0, 165], [0, 43], [12, 1], [6, 1], [4, 1], [2, 1], [0, 90], [0, 136], [0, 179], [2, 1], [0, 59], [2, 1], [0, 121], [0, 166], [6, 1], [4, 1], [2, 1], [0, 106], [0, 180], [0, 192], [4, 1], [2, 1], [0, 12], [0, 152], [0, 193], [60, 1], [22, 1], [10, 1], [6, 1], [2, 1], [0, 28], [2, 1], [0, 137], [0, 181], [2, 1], [0, 91], [0, 194], [4, 1], [2, 1], [0, 44], [0, 60], [4, 1], [2, 1], [0, 182], [0, 107], [2, 1], [0, 196], [0, 76], [16, 1], [8, 1], [4, 1], [2, 1], [0, 168], [0, 138], [2, 1], [0, 208], [0, 13], [2, 1], [0, 209], [2, 1], [0, 75], [2, 1], [0, 151], [0, 167], [12, 1], [6, 1], [2, 1], [0, 195], [2, 1], [0, 122], [0, 153], [4, 1], [2, 1], [0, 197], [0, 92], [0, 183], [4, 1], [2, 1], [0, 29], [0, 210], [2, 1], [0, 45], [2, 1], [0, 123], [0, 211], [52, 1], [28, 1], [12, 1], [4, 1], [2, 1], [0, 61], [0, 198], [4, 1], [2, 1], [0, 108], [0, 169], [2, 1], [0, 154], [0, 212], [8, 1], [4, 1], [2, 1], [0, 184], [0, 139], [2, 1], [0, 77], [0, 199], [4, 1], [2, 1], [0, 124], [0, 213], [2, 1], [0, 93], [0, 224], [10, 1], [4, 1], [2, 1], [0, 225], [0, 30], [4, 1], [2, 1], [0, 14], [0, 46], [0, 226], [8, 1], [4, 1], [2, 1], [0, 227], [0, 109], [2, 1], [0, 140], [0, 228], [4, 1], [2, 1], [0, 229], [0, 186], [0, 240], [38, 1], [16, 1], [4, 1], [2, 1], [0, 241], [0, 31], [6, 1], [4, 1], [2, 1], [0, 170], [0, 155], [0, 185], [2, 1], [0, 62], [2, 1], [0, 214], [0, 200], [12, 1], [6, 1], [2, 1], [0, 78], [2, 1], [0, 215], [0, 125], [2, 1], [0, 171], [2, 1], [0, 94], [0, 201], [6, 1], [2, 1], [0, 15], [2, 1], [0, 156], [0, 110], [2, 1], [0, 242], [0, 47], [32, 1], [16, 1], [6, 1], [4, 1], [2, 1], [0, 216], [0, 141], [0, 63], [6, 1], [2, 1], [0, 243], [2, 1], [0, 230], [0, 202], [2, 1], [0, 244], [0, 79], [8, 1], [4, 1], [2, 1], [0, 187], [0, 172], [2, 1], [0, 231], [0, 245], [4, 1], [2, 1], [0, 217], [0, 157], [2, 1], [0, 95], [0, 232], [30, 1], [12, 1], [6, 1], [2, 1], [0, 111], [2, 1], [0, 246], [0, 203], [4, 1], [2, 1], [0, 188], [0, 173], [0, 218], [8, 1], [2, 1], [0, 247], [4, 1], [2, 1], [0, 126], [0, 127], [0, 142], [6, 1], [4, 1], [2, 1], [0, 158], [0, 174], [0, 204], [2, 1], [0, 248], [0, 143], [18, 1], [8, 1], [4, 1], [2, 1], [0, 219], [0, 189], [2, 1], [0, 234], [0, 249], [4, 1], [2, 1], [0, 159], [0, 235], [2, 1], [0, 190], [2, 1], [0, 205], [0, 250], [14, 1], [4, 1], [2, 1], [0, 221], [0, 236], [6, 1], [4, 1], [2, 1], [0, 233], [0, 175], [0, 220], [2, 1], [0, 206], [0, 251], [8, 1], [4, 1], [2, 1], [0, 191], [0, 222], [2, 1], [0, 207], [0, 238], [4, 1], [2, 1], [0, 223], [0, 239], [2, 1], [0, 255], [2, 1], [0, 237], [2, 1], [0, 253], [2, 1], [0, 252], [0, 254]];
	huffcodetab.ValTab14 = [[0, 0]];
	huffcodetab.ValTab15 = [[16, 1], [6, 1], [2, 1], [0, 0], [2, 1], [0, 16], [0, 1], [2, 1], [0, 17], [4, 1], [2, 1], [0, 32], [0, 2], [2, 1], [0, 33], [0, 18], [50, 1], [16, 1], [6, 1], [2, 1], [0, 34], [2, 1], [0, 48], [0, 49], [6, 1], [2, 1], [0, 19], [2, 1], [0, 3], [0, 64], [2, 1], [0, 50], [0, 35], [14, 1], [6, 1], [4, 1], [2, 1], [0, 4], [0, 20], [0, 65], [4, 1], [2, 1], [0, 51], [0, 66], [2, 1], [0, 36], [0, 67], [10, 1], [6, 1], [2, 1], [0, 52], [2, 1], [0, 80], [0, 5], [2, 1], [0, 81], [0, 21], [4, 1], [2, 1], [0, 82], [0, 37], [4, 1], [2, 1], [0, 68], [0, 83], [0, 97], [90, 1], [36, 1], [18, 1], [10, 1], [6, 1], [2, 1], [0, 53], [2, 1], [0, 96], [0, 6], [2, 1], [0, 22], [0, 98], [4, 1], [2, 1], [0, 38], [0, 84], [2, 1], [0, 69], [0, 99], [10, 1], [6, 1], [2, 1], [0, 54], [2, 1], [0, 112], [0, 7], [2, 1], [0, 113], [0, 85], [4, 1], [2, 1], [0, 23], [0, 100], [2, 1], [0, 114], [0, 39], [24, 1], [16, 1], [8, 1], [4, 1], [2, 1], [0, 70], [0, 115], [2, 1], [0, 55], [0, 101], [4, 1], [2, 1], [0, 86], [0, 128], [2, 1], [0, 8], [0, 116], [4, 1], [2, 1], [0, 129], [0, 24], [2, 1], [0, 130], [0, 40], [16, 1], [8, 1], [4, 1], [2, 1], [0, 71], [0, 102], [2, 1], [0, 131], [0, 56], [4, 1], [2, 1], [0, 117], [0, 87], [2, 1], [0, 132], [0, 72], [6, 1], [4, 1], [2, 1], [0, 144], [0, 25], [0, 145], [4, 1], [2, 1], [0, 146], [0, 118], [2, 1], [0, 103], [0, 41], [92, 1], [36, 1], [18, 1], [10, 1], [4, 1], [2, 1], [0, 133], [0, 88], [4, 1], [2, 1], [0, 9], [0, 119], [0, 147], [4, 1], [2, 1], [0, 57], [0, 148], [2, 1], [0, 73], [0, 134], [10, 1], [6, 1], [2, 1], [0, 104], [2, 1], [0, 160], [0, 10], [2, 1], [0, 161], [0, 26], [4, 1], [2, 1], [0, 162], [0, 42], [2, 1], [0, 149], [0, 89], [26, 1], [14, 1], [6, 1], [2, 1], [0, 163], [2, 1], [0, 58], [0, 135], [4, 1], [2, 1], [0, 120], [0, 164], [2, 1], [0, 74], [0, 150], [6, 1], [4, 1], [2, 1], [0, 105], [0, 176], [0, 177], [4, 1], [2, 1], [0, 27], [0, 165], [0, 178], [14, 1], [8, 1], [4, 1], [2, 1], [0, 90], [0, 43], [2, 1], [0, 136], [0, 151], [2, 1], [0, 179], [2, 1], [0, 121], [0, 59], [8, 1], [4, 1], [2, 1], [0, 106], [0, 180], [2, 1], [0, 75], [0, 193], [4, 1], [2, 1], [0, 152], [0, 137], [2, 1], [0, 28], [0, 181], [80, 1], [34, 1], [16, 1], [6, 1], [4, 1], [2, 1], [0, 91], [0, 44], [0, 194], [6, 1], [4, 1], [2, 1], [0, 11], [0, 192], [0, 166], [2, 1], [0, 167], [0, 122], [10, 1], [4, 1], [2, 1], [0, 195], [0, 60], [4, 1], [2, 1], [0, 12], [0, 153], [0, 182], [4, 1], [2, 1], [0, 107], [0, 196], [2, 1], [0, 76], [0, 168], [20, 1], [10, 1], [4, 1], [2, 1], [0, 138], [0, 197], [4, 1], [2, 1], [0, 208], [0, 92], [0, 209], [4, 1], [2, 1], [0, 183], [0, 123], [2, 1], [0, 29], [2, 1], [0, 13], [0, 45], [12, 1], [4, 1], [2, 1], [0, 210], [0, 211], [4, 1], [2, 1], [0, 61], [0, 198], [2, 1], [0, 108], [0, 169], [6, 1], [4, 1], [2, 1], [0, 154], [0, 184], [0, 212], [4, 1], [2, 1], [0, 139], [0, 77], [2, 1], [0, 199], [0, 124], [68, 1], [34, 1], [18, 1], [10, 1], [4, 1], [2, 1], [0, 213], [0, 93], [4, 1], [2, 1], [0, 224], [0, 14], [0, 225], [4, 1], [2, 1], [0, 30], [0, 226], [2, 1], [0, 170], [0, 46], [8, 1], [4, 1], [2, 1], [0, 185], [0, 155], [2, 1], [0, 227], [0, 214], [4, 1], [2, 1], [0, 109], [0, 62], [2, 1], [0, 200], [0, 140], [16, 1], [8, 1], [4, 1], [2, 1], [0, 228], [0, 78], [2, 1], [0, 215], [0, 125], [4, 1], [2, 1], [0, 229], [0, 186], [2, 1], [0, 171], [0, 94], [8, 1], [4, 1], [2, 1], [0, 201], [0, 156], [2, 1], [0, 241], [0, 31], [6, 1], [4, 1], [2, 1], [0, 240], [0, 110], [0, 242], [2, 1], [0, 47], [0, 230], [38, 1], [18, 1], [8, 1], [4, 1], [2, 1], [0, 216], [0, 243], [2, 1], [0, 63], [0, 244], [6, 1], [2, 1], [0, 79], [2, 1], [0, 141], [0, 217], [2, 1], [0, 187], [0, 202], [8, 1], [4, 1], [2, 1], [0, 172], [0, 231], [2, 1], [0, 126], [0, 245], [8, 1], [4, 1], [2, 1], [0, 157], [0, 95], [2, 1], [0, 232], [0, 142], [2, 1], [0, 246], [0, 203], [34, 1], [18, 1], [10, 1], [6, 1], [4, 1], [2, 1], [0, 15], [0, 174], [0, 111], [2, 1], [0, 188], [0, 218], [4, 1], [2, 1], [0, 173], [0, 247], [2, 1], [0, 127], [0, 233], [8, 1], [4, 1], [2, 1], [0, 158], [0, 204], [2, 1], [0, 248], [0, 143], [4, 1], [2, 1], [0, 219], [0, 189], [2, 1], [0, 234], [0, 249], [16, 1], [8, 1], [4, 1], [2, 1], [0, 159], [0, 220], [2, 1], [0, 205], [0, 235], [4, 1], [2, 1], [0, 190], [0, 250], [2, 1], [0, 175], [0, 221], [14, 1], [6, 1], [4, 1], [2, 1], [0, 236], [0, 206], [0, 251], [4, 1], [2, 1], [0, 191], [0, 237], [2, 1], [0, 222], [0, 252], [6, 1], [4, 1], [2, 1], [0, 207], [0, 253], [0, 238], [4, 1], [2, 1], [0, 223], [0, 254], [2, 1], [0, 239], [0, 255]];
	huffcodetab.ValTab16 = [[2, 1], [0, 0], [6, 1], [2, 1], [0, 16], [2, 1], [0, 1], [0, 17], [42, 1], [8, 1], [4, 1], [2, 1], [0, 32], [0, 2], [2, 1], [0, 33], [0, 18], [10, 1], [6, 1], [2, 1], [0, 34], [2, 1], [0, 48], [0, 3], [2, 1], [0, 49], [0, 19], [10, 1], [4, 1], [2, 1], [0, 50], [0, 35], [4, 1], [2, 1], [0, 64], [0, 4], [0, 65], [6, 1], [2, 1], [0, 20], [2, 1], [0, 51], [0, 66], [4, 1], [2, 1], [0, 36], [0, 80], [2, 1], [0, 67], [0, 52], [138, 1], [40, 1], [16, 1], [6, 1], [4, 1], [2, 1], [0, 5], [0, 21], [0, 81], [4, 1], [2, 1], [0, 82], [0, 37], [4, 1], [2, 1], [0, 68], [0, 53], [0, 83], [10, 1], [6, 1], [4, 1], [2, 1], [0, 96], [0, 6], [0, 97], [2, 1], [0, 22], [0, 98], [8, 1], [4, 1], [2, 1], [0, 38], [0, 84], [2, 1], [0, 69], [0, 99], [4, 1], [2, 1], [0, 54], [0, 112], [0, 113], [40, 1], [18, 1], [8, 1], [2, 1], [0, 23], [2, 1], [0, 7], [2, 1], [0, 85], [0, 100], [4, 1], [2, 1], [0, 114], [0, 39], [4, 1], [2, 1], [0, 70], [0, 101], [0, 115], [10, 1], [6, 1], [2, 1], [0, 55], [2, 1], [0, 86], [0, 8], [2, 1], [0, 128], [0, 129], [6, 1], [2, 1], [0, 24], [2, 1], [0, 116], [0, 71], [2, 1], [0, 130], [2, 1], [0, 40], [0, 102], [24, 1], [14, 1], [8, 1], [4, 1], [2, 1], [0, 131], [0, 56], [2, 1], [0, 117], [0, 132], [4, 1], [2, 1], [0, 72], [0, 144], [0, 145], [6, 1], [2, 1], [0, 25], [2, 1], [0, 9], [0, 118], [2, 1], [0, 146], [0, 41], [14, 1], [8, 1], [4, 1], [2, 1], [0, 133], [0, 88], [2, 1], [0, 147], [0, 57], [4, 1], [2, 1], [0, 160], [0, 10], [0, 26], [8, 1], [2, 1], [0, 162], [2, 1], [0, 103], [2, 1], [0, 87], [0, 73], [6, 1], [2, 1], [0, 148], [2, 1], [0, 119], [0, 134], [2, 1], [0, 161], [2, 1], [0, 104], [0, 149], [220, 1], [126, 1], [50, 1], [26, 1], [12, 1], [6, 1], [2, 1], [0, 42], [2, 1], [0, 89], [0, 58], [2, 1], [0, 163], [2, 1], [0, 135], [0, 120], [8, 1], [4, 1], [2, 1], [0, 164], [0, 74], [2, 1], [0, 150], [0, 105], [4, 1], [2, 1], [0, 176], [0, 11], [0, 177], [10, 1], [4, 1], [2, 1], [0, 27], [0, 178], [2, 1], [0, 43], [2, 1], [0, 165], [0, 90], [6, 1], [2, 1], [0, 179], [2, 1], [0, 166], [0, 106], [4, 1], [2, 1], [0, 180], [0, 75], [2, 1], [0, 12], [0, 193], [30, 1], [14, 1], [6, 1], [4, 1], [2, 1], [0, 181], [0, 194], [0, 44], [4, 1], [2, 1], [0, 167], [0, 195], [2, 1], [0, 107], [0, 196], [8, 1], [2, 1], [0, 29], [4, 1], [2, 1], [0, 136], [0, 151], [0, 59], [4, 1], [2, 1], [0, 209], [0, 210], [2, 1], [0, 45], [0, 211], [18, 1], [6, 1], [4, 1], [2, 1], [0, 30], [0, 46], [0, 226], [6, 1], [4, 1], [2, 1], [0, 121], [0, 152], [0, 192], [2, 1], [0, 28], [2, 1], [0, 137], [0, 91], [14, 1], [6, 1], [2, 1], [0, 60], [2, 1], [0, 122], [0, 182], [4, 1], [2, 1], [0, 76], [0, 153], [2, 1], [0, 168], [0, 138], [6, 1], [2, 1], [0, 13], [2, 1], [0, 197], [0, 92], [4, 1], [2, 1], [0, 61], [0, 198], [2, 1], [0, 108], [0, 154], [88, 1], [86, 1], [36, 1], [16, 1], [8, 1], [4, 1], [2, 1], [0, 139], [0, 77], [2, 1], [0, 199], [0, 124], [4, 1], [2, 1], [0, 213], [0, 93], [2, 1], [0, 224], [0, 14], [8, 1], [2, 1], [0, 227], [4, 1], [2, 1], [0, 208], [0, 183], [0, 123], [6, 1], [4, 1], [2, 1], [0, 169], [0, 184], [0, 212], [2, 1], [0, 225], [2, 1], [0, 170], [0, 185], [24, 1], [10, 1], [6, 1], [4, 1], [2, 1], [0, 155], [0, 214], [0, 109], [2, 1], [0, 62], [0, 200], [6, 1], [4, 1], [2, 1], [0, 140], [0, 228], [0, 78], [4, 1], [2, 1], [0, 215], [0, 229], [2, 1], [0, 186], [0, 171], [12, 1], [4, 1], [2, 1], [0, 156], [0, 230], [4, 1], [2, 1], [0, 110], [0, 216], [2, 1], [0, 141], [0, 187], [8, 1], [4, 1], [2, 1], [0, 231], [0, 157], [2, 1], [0, 232], [0, 142], [4, 1], [2, 1], [0, 203], [0, 188], [0, 158], [0, 241], [2, 1], [0, 31], [2, 1], [0, 15], [0, 47], [66, 1], [56, 1], [2, 1], [0, 242], [52, 1], [50, 1], [20, 1], [8, 1], [2, 1], [0, 189], [2, 1], [0, 94], [2, 1], [0, 125], [0, 201], [6, 1], [2, 1], [0, 202], [2, 1], [0, 172], [0, 126], [4, 1], [2, 1], [0, 218], [0, 173], [0, 204], [10, 1], [6, 1], [2, 1], [0, 174], [2, 1], [0, 219], [0, 220], [2, 1], [0, 205], [0, 190], [6, 1], [4, 1], [2, 1], [0, 235], [0, 237], [0, 238], [6, 1], [4, 1], [2, 1], [0, 217], [0, 234], [0, 233], [2, 1], [0, 222], [4, 1], [2, 1], [0, 221], [0, 236], [0, 206], [0, 63], [0, 240], [4, 1], [2, 1], [0, 243], [0, 244], [2, 1], [0, 79], [2, 1], [0, 245], [0, 95], [10, 1], [2, 1], [0, 255], [4, 1], [2, 1], [0, 246], [0, 111], [2, 1], [0, 247], [0, 127], [12, 1], [6, 1], [2, 1], [0, 143], [2, 1], [0, 248], [0, 249], [4, 1], [2, 1], [0, 159], [0, 250], [0, 175], [8, 1], [4, 1], [2, 1], [0, 251], [0, 191], [2, 1], [0, 252], [0, 207], [4, 1], [2, 1], [0, 253], [0, 223], [2, 1], [0, 254], [0, 239]];
	huffcodetab.ValTab24 = [[60, 1], [8, 1], [4, 1], [2, 1], [0, 0], [0, 16], [2, 1], [0, 1], [0, 17], [14, 1], [6, 1], [4, 1], [2, 1], [0, 32], [0, 2], [0, 33], [2, 1], [0, 18], [2, 1], [0, 34], [2, 1], [0, 48], [0, 3], [14, 1], [4, 1], [2, 1], [0, 49], [0, 19], [4, 1], [2, 1], [0, 50], [0, 35], [4, 1], [2, 1], [0, 64], [0, 4], [0, 65], [8, 1], [4, 1], [2, 1], [0, 20], [0, 51], [2, 1], [0, 66], [0, 36], [6, 1], [4, 1], [2, 1], [0, 67], [0, 52], [0, 81], [6, 1], [4, 1], [2, 1], [0, 80], [0, 5], [0, 21], [2, 1], [0, 82], [0, 37], [250, 1], [98, 1], [34, 1], [18, 1], [10, 1], [4, 1], [2, 1], [0, 68], [0, 83], [2, 1], [0, 53], [2, 1], [0, 96], [0, 6], [4, 1], [2, 1], [0, 97], [0, 22], [2, 1], [0, 98], [0, 38], [8, 1], [4, 1], [2, 1], [0, 84], [0, 69], [2, 1], [0, 99], [0, 54], [4, 1], [2, 1], [0, 113], [0, 85], [2, 1], [0, 100], [0, 70], [32, 1], [14, 1], [6, 1], [2, 1], [0, 114], [2, 1], [0, 39], [0, 55], [2, 1], [0, 115], [4, 1], [2, 1], [0, 112], [0, 7], [0, 23], [10, 1], [4, 1], [2, 1], [0, 101], [0, 86], [4, 1], [2, 1], [0, 128], [0, 8], [0, 129], [4, 1], [2, 1], [0, 116], [0, 71], [2, 1], [0, 24], [0, 130], [16, 1], [8, 1], [4, 1], [2, 1], [0, 40], [0, 102], [2, 1], [0, 131], [0, 56], [4, 1], [2, 1], [0, 117], [0, 87], [2, 1], [0, 132], [0, 72], [8, 1], [4, 1], [2, 1], [0, 145], [0, 25], [2, 1], [0, 146], [0, 118], [4, 1], [2, 1], [0, 103], [0, 41], [2, 1], [0, 133], [0, 88], [92, 1], [34, 1], [16, 1], [8, 1], [4, 1], [2, 1], [0, 147], [0, 57], [2, 1], [0, 148], [0, 73], [4, 1], [2, 1], [0, 119], [0, 134], [2, 1], [0, 104], [0, 161], [8, 1], [4, 1], [2, 1], [0, 162], [0, 42], [2, 1], [0, 149], [0, 89], [4, 1], [2, 1], [0, 163], [0, 58], [2, 1], [0, 135], [2, 1], [0, 120], [0, 74], [22, 1], [12, 1], [4, 1], [2, 1], [0, 164], [0, 150], [4, 1], [2, 1], [0, 105], [0, 177], [2, 1], [0, 27], [0, 165], [6, 1], [2, 1], [0, 178], [2, 1], [0, 90], [0, 43], [2, 1], [0, 136], [0, 179], [16, 1], [10, 1], [6, 1], [2, 1], [0, 144], [2, 1], [0, 9], [0, 160], [2, 1], [0, 151], [0, 121], [4, 1], [2, 1], [0, 166], [0, 106], [0, 180], [12, 1], [6, 1], [2, 1], [0, 26], [2, 1], [0, 10], [0, 176], [2, 1], [0, 59], [2, 1], [0, 11], [0, 192], [4, 1], [2, 1], [0, 75], [0, 193], [2, 1], [0, 152], [0, 137], [67, 1], [34, 1], [16, 1], [8, 1], [4, 1], [2, 1], [0, 28], [0, 181], [2, 1], [0, 91], [0, 194], [4, 1], [2, 1], [0, 44], [0, 167], [2, 1], [0, 122], [0, 195], [10, 1], [6, 1], [2, 1], [0, 60], [2, 1], [0, 12], [0, 208], [2, 1], [0, 182], [0, 107], [4, 1], [2, 1], [0, 196], [0, 76], [2, 1], [0, 153], [0, 168], [16, 1], [8, 1], [4, 1], [2, 1], [0, 138], [0, 197], [2, 1], [0, 92], [0, 209], [4, 1], [2, 1], [0, 183], [0, 123], [2, 1], [0, 29], [0, 210], [9, 1], [4, 1], [2, 1], [0, 45], [0, 211], [2, 1], [0, 61], [0, 198], [85, 250], [4, 1], [2, 1], [0, 108], [0, 169], [2, 1], [0, 154], [0, 212], [32, 1], [16, 1], [8, 1], [4, 1], [2, 1], [0, 184], [0, 139], [2, 1], [0, 77], [0, 199], [4, 1], [2, 1], [0, 124], [0, 213], [2, 1], [0, 93], [0, 225], [8, 1], [4, 1], [2, 1], [0, 30], [0, 226], [2, 1], [0, 170], [0, 185], [4, 1], [2, 1], [0, 155], [0, 227], [2, 1], [0, 214], [0, 109], [20, 1], [10, 1], [6, 1], [2, 1], [0, 62], [2, 1], [0, 46], [0, 78], [2, 1], [0, 200], [0, 140], [4, 1], [2, 1], [0, 228], [0, 215], [4, 1], [2, 1], [0, 125], [0, 171], [0, 229], [10, 1], [4, 1], [2, 1], [0, 186], [0, 94], [2, 1], [0, 201], [2, 1], [0, 156], [0, 110], [8, 1], [2, 1], [0, 230], [2, 1], [0, 13], [2, 1], [0, 224], [0, 14], [4, 1], [2, 1], [0, 216], [0, 141], [2, 1], [0, 187], [0, 202], [74, 1], [2, 1], [0, 255], [64, 1], [58, 1], [32, 1], [16, 1], [8, 1], [4, 1], [2, 1], [0, 172], [0, 231], [2, 1], [0, 126], [0, 217], [4, 1], [2, 1], [0, 157], [0, 232], [2, 1], [0, 142], [0, 203], [8, 1], [4, 1], [2, 1], [0, 188], [0, 218], [2, 1], [0, 173], [0, 233], [4, 1], [2, 1], [0, 158], [0, 204], [2, 1], [0, 219], [0, 189], [16, 1], [8, 1], [4, 1], [2, 1], [0, 234], [0, 174], [2, 1], [0, 220], [0, 205], [4, 1], [2, 1], [0, 235], [0, 190], [2, 1], [0, 221], [0, 236], [8, 1], [4, 1], [2, 1], [0, 206], [0, 237], [2, 1], [0, 222], [0, 238], [0, 15], [4, 1], [2, 1], [0, 240], [0, 31], [0, 241], [4, 1], [2, 1], [0, 242], [0, 47], [2, 1], [0, 243], [0, 63], [18, 1], [8, 1], [4, 1], [2, 1], [0, 244], [0, 79], [2, 1], [0, 245], [0, 95], [4, 1], [2, 1], [0, 246], [0, 111], [2, 1], [0, 247], [2, 1], [0, 127], [0, 143], [10, 1], [4, 1], [2, 1], [0, 248], [0, 249], [4, 1], [2, 1], [0, 159], [0, 175], [0, 250], [8, 1], [4, 1], [2, 1], [0, 251], [0, 191], [2, 1], [0, 252], [0, 207], [4, 1], [2, 1], [0, 253], [0, 223], [2, 1], [0, 254], [0, 239]];
	huffcodetab.ValTab32 = [[2, 1], [0, 0], [8, 1], [4, 1], [2, 1], [0, 8], [0, 4], [2, 1], [0, 1], [0, 2], [8, 1], [4, 1], [2, 1], [0, 12], [0, 10], [2, 1], [0, 3], [0, 6], [6, 1], [2, 1], [0, 9], [2, 1], [0, 5], [0, 7], [4, 1], [2, 1], [0, 14], [0, 13], [2, 1], [0, 15], [0, 11]];huffcodetab.ValTab33 = [[16, 1], [8, 1], [4, 1], [2, 1], [0, 0], [0, 1], [2, 1], [0, 2], [0, 3], [4, 1], [2, 1], [0, 4], [0, 5], [2, 1], [0, 6], [0, 7], [8, 1], [4, 1], [2, 1], [0, 8], [0, 9], [2, 1], [0, 10], [0, 11], [4, 1], [2, 1], [0, 12], [0, 13], [2, 1], [0, 14], [0, 15]];
	huffcodetab.ht = null;
	huffcodetab.initHuff = function() {
		if (huffcodetab.ht != null) return;
		huffcodetab.ht = [];
		huffcodetab.ht[0] = new huffcodetab("0  ", 0, 0, 0, 0, -1, huffcodetab.ValTab0, 0);
		huffcodetab.ht[1] = new huffcodetab("1  ", 2, 2, 0, 0, -1, huffcodetab.ValTab1, 7);
		huffcodetab.ht[2] = new huffcodetab("2  ", 3, 3, 0, 0, -1, huffcodetab.ValTab2, 17);
		huffcodetab.ht[3] = new huffcodetab("3  ", 3, 3, 0, 0, -1, huffcodetab.ValTab3, 17);
		huffcodetab.ht[4] = new huffcodetab("4  ", 0, 0, 0, 0, -1, huffcodetab.ValTab4, 0);
		huffcodetab.ht[5] = new huffcodetab("5  ", 4, 4, 0, 0, -1, huffcodetab.ValTab5, 31);
		huffcodetab.ht[6] = new huffcodetab("6  ", 4, 4, 0, 0, -1, huffcodetab.ValTab6, 31);
		huffcodetab.ht[7] = new huffcodetab("7  ", 6, 6, 0, 0, -1, huffcodetab.ValTab7, 71);
		huffcodetab.ht[8] = new huffcodetab("8  ", 6, 6, 0, 0, -1, huffcodetab.ValTab8, 71);
		huffcodetab.ht[9] = new huffcodetab("9  ", 6, 6, 0, 0, -1, huffcodetab.ValTab9, 71);
		huffcodetab.ht[10] = new huffcodetab("10 ", 8, 8, 0, 0, -1, huffcodetab.ValTab10, 127);
		huffcodetab.ht[11] = new huffcodetab("11 ", 8, 8, 0, 0, -1, huffcodetab.ValTab11, 127);
		huffcodetab.ht[12] = new huffcodetab("12 ", 8, 8, 0, 0, -1, huffcodetab.ValTab12, 127);
		huffcodetab.ht[13] = new huffcodetab("13 ", 16, 16, 0, 0, -1, huffcodetab.ValTab13, 511);
		huffcodetab.ht[14] = new huffcodetab("14 ", 0, 0, 0, 0, -1, huffcodetab.ValTab14, 0);
		huffcodetab.ht[15] = new huffcodetab("15 ", 16, 16, 0, 0, -1, huffcodetab.ValTab15, 511);
		huffcodetab.ht[16] = new huffcodetab("16 ", 16, 16, 1, 1, -1, huffcodetab.ValTab16, 511);
		huffcodetab.ht[17] = new huffcodetab("17 ", 16, 16, 2, 3, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[18] = new huffcodetab("18 ", 16, 16, 3, 7, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[19] = new huffcodetab("19 ", 16, 16, 4, 15, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[20] = new huffcodetab("20 ", 16, 16, 6, 63, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[21] = new huffcodetab("21 ", 16, 16, 8, 255, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[22] = new huffcodetab("22 ", 16, 16, 10, 1023, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[23] = new huffcodetab("23 ", 16, 16, 13, 8191, 16, huffcodetab.ValTab16, 511);
		huffcodetab.ht[24] = new huffcodetab("24 ", 16, 16, 4, 15, -1, huffcodetab.ValTab24, 512);
		huffcodetab.ht[25] = new huffcodetab("25 ", 16, 16, 5, 31, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[26] = new huffcodetab("26 ", 16, 16, 6, 63, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[27] = new huffcodetab("27 ", 16, 16, 7, 127, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[28] = new huffcodetab("28 ", 16, 16, 8, 255, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[29] = new huffcodetab("29 ", 16, 16, 9, 511, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[30] = new huffcodetab("30 ", 16, 16, 11, 2047, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[31] = new huffcodetab("31 ", 16, 16, 13, 8191, 24, huffcodetab.ValTab24, 512);
		huffcodetab.ht[32] = new huffcodetab("32 ", 1, 16, 0, 0, -1, huffcodetab.ValTab32, 31);
		huffcodetab.ht[33] = new huffcodetab("33 ", 1, 16, 0, 0, -1, huffcodetab.ValTab33, 31);
	}
	huffcodetab.huffman_decoder = function(h, x, y, v, w, br) {
		var dmask = 1 << ((4 * 8) - 1);
		var hs = 4 * 8;
		var level;
		var point = 0;
		var error = 1;
		level = dmask;
		if (h.val == null) return 2;
		if (h.treelen == 0) {
			x[0] = y[0] = 0;
			return 0;
		}
		do {
			if (h.val[point][0] == 0) {
				x[0] = h.val[point][1] >>> 4;
				y[0] = h.val[point][1] & 0xf;
				error = 0;
				break;
			}
			if (br.hget1bit() != 0) {
				while (h.val[point][1] >= huffcodetab.MXOFF) point += h.val[point][1];
				point += h.val[point][1];
			} else {
				while (h.val[point][0] >= huffcodetab.MXOFF) point += h.val[point][0];
				point += h.val[point][0];
			}
			level >>>= 1;
		} while ((level != 0) || (point < 0));
		if (h.tablename0 == '3' && (h.tablename1 == '2' || h.tablename1 == '3')) {
			v[0] = (y[0] >> 3) & 1;
			w[0] = (y[0] >> 2) & 1;
			x[0] = (y[0] >> 1) & 1;
			y[0] = y[0] & 1;
			if (v[0] != 0)
				if (br.hget1bit() != 0) v[0] = -v[0];
			if (w[0] != 0)
				if (br.hget1bit() != 0) w[0] = -w[0];
			if (x[0] != 0)
				if (br.hget1bit() != 0) x[0] = -x[0];
			if (y[0] != 0)
				if (br.hget1bit() != 0) y[0] = -y[0];
		} else {
			if (h.linbits != 0)
				if ((h.xlen - 1) == x[0])
					x[0] += br.hgetbits(h.linbits);
			if (x[0] != 0)
				if (br.hget1bit() != 0) x[0] = -x[0];
			if (h.linbits != 0)
				if ((h.ylen - 1) == y[0])
					y[0] += br.hgetbits(h.linbits);
			if (y[0] != 0)
				if (br.hget1bit() != 0) y[0] = -y[0];
		}
		return error;
	}
	const SynthesisFilter = function(channelnumber, factor, eq0) {
		if (SynthesisFilter.d == null) {
			SynthesisFilter.d = SynthesisFilter.load_d();
			SynthesisFilter.d16 = SynthesisFilter.splitArray(SynthesisFilter.d, 16);
		}
		this.v1 = new Float32Array(512);
		this.v2 = new Float32Array(512);
		this._tmpOut = new Float32Array(32);
		this.samples = new Float32Array(32);
		this.channel = channelnumber;
		this.scalefactor = factor;
		this.setEQ(this.eq);
		this.reset();
	}
	SynthesisFilter.d = null;
	SynthesisFilter.d16 = null;
	SynthesisFilter.load_d = function() {
		return new Float32Array([0.000000000, -0.000442505,  0.003250122, -0.007003784, 0.031082153, -0.078628540,  0.100311279, -0.572036743, 1.144989014,  0.572036743,  0.100311279,  0.078628540, 0.031082153,  0.007003784,  0.003250122,  0.000442505, -0.000015259, -0.000473022,  0.003326416, -0.007919312, 0.030517578, -0.084182739,  0.090927124, -0.600219727, 1.144287109,  0.543823242,  0.108856201,  0.073059082, 0.031478882,  0.006118774,  0.003173828,  0.000396729, -0.000015259, -0.000534058,  0.003387451, -0.008865356, 0.029785156, -0.089706421,  0.080688477, -0.628295898, 1.142211914,  0.515609741,  0.116577148,  0.067520142, 0.031738281,  0.005294800,  0.003082275,  0.000366211, -0.000015259, -0.000579834,  0.003433228, -0.009841919, 0.028884888, -0.095169067,  0.069595337, -0.656219482, 1.138763428,  0.487472534,  0.123474121,  0.061996460, 0.031845093,  0.004486084,  0.002990723,  0.000320435, -0.000015259, -0.000625610,  0.003463745, -0.010848999, 0.027801514, -0.100540161,  0.057617188, -0.683914185, 1.133926392,  0.459472656,  0.129577637,  0.056533813, 0.031814575,  0.003723145,  0.002899170,  0.000289917, -0.000015259, -0.000686646,  0.003479004, -0.011886597, 0.026535034, -0.105819702,  0.044784546, -0.711318970, 1.127746582,  0.431655884,  0.134887695,  0.051132202, 0.031661987,  0.003005981,  0.002792358,  0.000259399, -0.000015259, -0.000747681,  0.003479004, -0.012939453, 0.025085449, -0.110946655,  0.031082153, -0.738372803, 1.120223999,  0.404083252,  0.139450073,  0.045837402, 0.031387329,  0.002334595,  0.002685547,  0.000244141, -0.000030518, -0.000808716,  0.003463745, -0.014022827, 0.023422241, -0.115921021,  0.016510010, -0.765029907, 1.111373901,  0.376800537,  0.143264771,  0.040634155, 0.031005859,  0.001693726,  0.002578735,  0.000213623, -0.000030518, -0.000885010,  0.003417969, -0.015121460, 0.021575928, -0.120697021,  0.001068115, -0.791213989, 1.101211548,  0.349868774,  0.146362305,  0.035552979, 0.030532837,  0.001098633,  0.002456665,  0.000198364, -0.000030518, -0.000961304,  0.003372192, -0.016235352, 0.019531250, -0.125259399, -0.015228271, -0.816864014, 1.089782715,  0.323318481,  0.148773193,  0.030609131, 0.029937744,  0.000549316,  0.002349854,  0.000167847, -0.000030518, -0.001037598,  0.003280640, -0.017349243, 0.017257690, -0.129562378, -0.032379150, -0.841949463, 1.077117920,  0.297210693,  0.150497437,  0.025817871, 0.029281616,  0.000030518,  0.002243042,  0.000152588, -0.000045776, -0.001113892,  0.003173828, -0.018463135, 0.014801025, -0.133590698, -0.050354004, -0.866363525, 1.063217163,  0.271591187,  0.151596069,  0.021179199, 0.028533936, -0.000442505,  0.002120972,  0.000137329, -0.000045776, -0.001205444,  0.003051758, -0.019577026, 0.012115479, -0.137298584, -0.069168091, -0.890090942, 1.048156738,  0.246505737,  0.152069092,  0.016708374, 0.027725220, -0.000869751,  0.002014160,  0.000122070, -0.000061035, -0.001296997,  0.002883911, -0.020690918, 0.009231567, -0.140670776, -0.088775635, -0.913055420, 1.031936646,  0.221984863,  0.151962280,  0.012420654, 0.026840210, -0.001266479,  0.001907349,  0.000106812, -0.000061035, -0.001388550,  0.002700806, -0.021789551, 0.006134033, -0.143676758, -0.109161377, -0.935195923, 1.014617920,  0.198059082,  0.151306152,  0.008316040, 0.025909424, -0.001617432,  0.001785278,  0.000106812, -0.000076294, -0.001480103,  0.002487183, -0.022857666, 0.002822876, -0.146255493, -0.130310059, -0.956481934, 0.996246338,  0.174789429,  0.150115967,  0.004394531, 0.024932861, -0.001937866,  0.001693726,  0.000091553, -0.000076294, -0.001586914,  0.002227783, -0.023910522, -0.000686646, -0.148422241, -0.152206421, -0.976852417, 0.976852417,  0.152206421,  0.148422241,  0.000686646, 0.023910522, -0.002227783,  0.001586914,  0.000076294, -0.000091553, -0.001693726,  0.001937866, -0.024932861, -0.004394531, -0.150115967, -0.174789429, -0.996246338, 0.956481934,  0.130310059,  0.146255493, -0.002822876, 0.022857666, -0.002487183,  0.001480103,  0.000076294, -0.000106812, -0.001785278,  0.001617432, -0.025909424, -0.008316040, -0.151306152, -0.198059082, -1.014617920, 0.935195923,  0.109161377,  0.143676758, -0.006134033, 0.021789551, -0.002700806,  0.001388550,  0.000061035, -0.000106812, -0.001907349,  0.001266479, -0.026840210, -0.012420654, -0.151962280, -0.221984863, -1.031936646, 0.913055420,  0.088775635,  0.140670776, -0.009231567, 0.020690918, -0.002883911,  0.001296997,  0.000061035, -0.000122070, -0.002014160,  0.000869751, -0.027725220, -0.016708374, -0.152069092, -0.246505737, -1.048156738, 0.890090942,  0.069168091,  0.137298584, -0.012115479, 0.019577026, -0.003051758,  0.001205444,  0.000045776, -0.000137329, -0.002120972,  0.000442505, -0.028533936, -0.021179199, -0.151596069, -0.271591187, -1.063217163, 0.866363525,  0.050354004,  0.133590698, -0.014801025, 0.018463135, -0.003173828,  0.001113892,  0.000045776, -0.000152588, -0.002243042, -0.000030518, -0.029281616, -0.025817871, -0.150497437, -0.297210693, -1.077117920, 0.841949463,  0.032379150,  0.129562378, -0.017257690, 0.017349243, -0.003280640,  0.001037598,  0.000030518, -0.000167847, -0.002349854, -0.000549316, -0.029937744, -0.030609131, -0.148773193, -0.323318481, -1.089782715, 0.816864014,  0.015228271,  0.125259399, -0.019531250, 0.016235352, -0.003372192,  0.000961304,  0.000030518, -0.000198364, -0.002456665, -0.001098633, -0.030532837, -0.035552979, -0.146362305, -0.349868774, -1.101211548, 0.791213989, -0.001068115,  0.120697021, -0.021575928, 0.015121460, -0.003417969,  0.000885010,  0.000030518, -0.000213623, -0.002578735, -0.001693726, -0.031005859, -0.040634155, -0.143264771, -0.376800537, -1.111373901, 0.765029907, -0.016510010,  0.115921021, -0.023422241, 0.014022827, -0.003463745,  0.000808716,  0.000030518, -0.000244141, -0.002685547, -0.002334595, -0.031387329, -0.045837402, -0.139450073, -0.404083252, -1.120223999, 0.738372803, -0.031082153,  0.110946655, -0.025085449, 0.012939453, -0.003479004,  0.000747681,  0.000015259, -0.000259399, -0.002792358, -0.003005981, -0.031661987, -0.051132202, -0.134887695, -0.431655884, -1.127746582, 0.711318970, -0.044784546,  0.105819702, -0.026535034, 0.011886597, -0.003479004,  0.000686646,  0.000015259, -0.000289917, -0.002899170, -0.003723145, -0.031814575, -0.056533813, -0.129577637, -0.459472656, -1.133926392, 0.683914185, -0.057617188,  0.100540161, -0.027801514, 0.010848999, -0.003463745,  0.000625610,  0.000015259, -0.000320435, -0.002990723, -0.004486084, -0.031845093, -0.061996460, -0.123474121, -0.487472534, -1.138763428, 0.656219482, -0.069595337,  0.095169067, -0.028884888, 0.009841919, -0.003433228,  0.000579834,  0.000015259, -0.000366211, -0.003082275, -0.005294800, -0.031738281, -0.067520142, -0.116577148, -0.515609741, -1.142211914, 0.628295898, -0.080688477,  0.089706421, -0.029785156, 0.008865356, -0.003387451,  0.000534058,  0.000015259, -0.000396729, -0.003173828, -0.006118774, -0.031478882, -0.073059082, -0.108856201, -0.543823242, -1.144287109, 0.600219727, -0.090927124,  0.084182739, -0.030517578, 0.007919312, -0.003326416,  0.000473022,  0.000015259]);
	};
	SynthesisFilter.subArray = function(array, offs, len) {
		if (offs + len > array.length) {
			len = array.length - offs;
		}
		if (len < 0) len = 0;
		var subarray = new Float32Array(len);
		arraycopy(array, offs + 0, subarray, 0, len);
		return subarray;
	}
	SynthesisFilter.splitArray = function(array, blockSize) {
		var size = (array.length / blockSize) | 0;
		var split = new Array(size);
		for (var i = 0; i < size; i++) {
			split[i] = SynthesisFilter.subArray(array, i * blockSize, blockSize);
		}
		return split;
	};
	SynthesisFilter.prototype.setEQ = function(eq0) {
		this.eq = eq0;
		if (this.eq == null) {
			this.eq = new Float32Array(32);
			for (var i = 0; i < 32; i++)
				this.eq[i] = 1;
		}
		if (this.eq.length < 32) {
			throw new Error("IllegalArgumentException(eq0)");
		}
	};
	SynthesisFilter.prototype.reset = function() {
		for (var p = 0; p < 512; p++)
			this.v1[p] = this.v2[p] = 0.0;
		for (var p2 = 0; p2 < 32; p2++)
			this.samples[p2] = 0.0;
		this.actual_v = this.v1;
		this.actual_write_pos = 15;
	};
	SynthesisFilter.prototype.input_sample = function() {
	};
	SynthesisFilter.prototype.input_samples = function(s) {
		for (var i = 31; i >= 0; i--) {
			this.samples[i] = s[i] * this.eq[i];
		}
	};
	SynthesisFilter.prototype.compute_new_v = function() {
		var new_v0, new_v1, new_v2, new_v3, new_v4, new_v5, new_v6, new_v7, new_v8, new_v9;
		var new_v10, new_v11, new_v12, new_v13, new_v14, new_v15, new_v16, new_v17, new_v18, new_v19;
		var new_v20, new_v21, new_v22, new_v23, new_v24, new_v25, new_v26, new_v27, new_v28, new_v29;
		var new_v30, new_v31;
		new_v0 = new_v1 = new_v2 = new_v3 = new_v4 = new_v5 = new_v6 = new_v7 = new_v8 = new_v9 = new_v10 = new_v11 = new_v12 = new_v13 = new_v14 = new_v15 = new_v16 = new_v17 = new_v18 = new_v19 = new_v20 = new_v21 = new_v22 = new_v23 = new_v24 = new_v25 = new_v26 = new_v27 = new_v28 = new_v29 = new_v30 = new_v31 = 0.0;
		var s = this.samples;
		var s0 = s[0];
		var s1 = s[1];
		var s2 = s[2];
		var s3 = s[3];
		var s4 = s[4];
		var s5 = s[5];
		var s6 = s[6];
		var s7 = s[7];
		var s8 = s[8];
		var s9 = s[9];
		var s10 = s[10];
		var s11 = s[11];
		var s12 = s[12];
		var s13 = s[13];
		var s14 = s[14];
		var s15 = s[15];
		var s16 = s[16];
		var s17 = s[17];
		var s18 = s[18];
		var s19 = s[19];
		var s20 = s[20];
		var s21 = s[21];
		var s22 = s[22];
		var s23 = s[23];
		var s24 = s[24];
		var s25 = s[25];
		var s26 = s[26];
		var s27 = s[27];
		var s28 = s[28];
		var s29 = s[29];
		var s30 = s[30];
		var s31 = s[31];
		var p0 = s0 + s31;
		var p1 = s1 + s30;
		var p2 = s2 + s29;
		var p3 = s3 + s28;
		var p4 = s4 + s27;
		var p5 = s5 + s26;
		var p6 = s6 + s25;
		var p7 = s7 + s24;
		var p8 = s8 + s23;
		var p9 = s9 + s22;
		var p10 = s10 + s21;
		var p11 = s11 + s20;
		var p12 = s12 + s19;
		var p13 = s13 + s18;
		var p14 = s14 + s17;
		var p15 = s15 + s16;
		var pp0 = p0 + p15;
		var pp1 = p1 + p14;
		var pp2 = p2 + p13;
		var pp3 = p3 + p12;
		var pp4 = p4 + p11;
		var pp5 = p5 + p10;
		var pp6 = p6 + p9;
		var pp7 = p7 + p8;
		var pp8 = (p0 - p15) * SynthesisFilter.cos1_32;
		var pp9 = (p1 - p14) * SynthesisFilter.cos3_32;
		var pp10 = (p2 - p13) * SynthesisFilter.cos5_32;
		var pp11 = (p3 - p12) * SynthesisFilter.cos7_32;
		var pp12 = (p4 - p11) * SynthesisFilter.cos9_32;
		var pp13 = (p5 - p10) * SynthesisFilter.cos11_32;
		var pp14 = (p6 - p9) * SynthesisFilter.cos13_32;
		var pp15 = (p7 - p8) * SynthesisFilter.cos15_32;
		p0 = pp0 + pp7;
		p1 = pp1 + pp6;
		p2 = pp2 + pp5;
		p3 = pp3 + pp4;
		p4 = (pp0 - pp7) * SynthesisFilter.cos1_16;
		p5 = (pp1 - pp6) * SynthesisFilter.cos3_16;
		p6 = (pp2 - pp5) * SynthesisFilter.cos5_16;
		p7 = (pp3 - pp4) * SynthesisFilter.cos7_16;
		p8 = pp8 + pp15;
		p9 = pp9 + pp14;
		p10 = pp10 + pp13;
		p11 = pp11 + pp12;
		p12 = (pp8 - pp15) * SynthesisFilter.cos1_16;
		p13 = (pp9 - pp14) * SynthesisFilter.cos3_16;
		p14 = (pp10 - pp13) * SynthesisFilter.cos5_16;
		p15 = (pp11 - pp12) * SynthesisFilter.cos7_16;
		pp0 = p0 + p3;
		pp1 = p1 + p2;
		pp2 = (p0 - p3) * SynthesisFilter.cos1_8;
		pp3 = (p1 - p2) * SynthesisFilter.cos3_8;
		pp4 = p4 + p7;
		pp5 = p5 + p6;
		pp6 = (p4 - p7) * SynthesisFilter.cos1_8;
		pp7 = (p5 - p6) * SynthesisFilter.cos3_8;
		pp8 = p8 + p11;
		pp9 = p9 + p10;
		pp10 = (p8 - p11) * SynthesisFilter.cos1_8;
		pp11 = (p9 - p10) * SynthesisFilter.cos3_8;
		pp12 = p12 + p15;
		pp13 = p13 + p14;
		pp14 = (p12 - p15) * SynthesisFilter.cos1_8;
		pp15 = (p13 - p14) * SynthesisFilter.cos3_8;
		p0 = pp0 + pp1;
		p1 = (pp0 - pp1) * SynthesisFilter.cos1_4;
		p2 = pp2 + pp3;
		p3 = (pp2 - pp3) * SynthesisFilter.cos1_4;
		p4 = pp4 + pp5;
		p5 = (pp4 - pp5) * SynthesisFilter.cos1_4;
		p6 = pp6 + pp7;
		p7 = (pp6 - pp7) * SynthesisFilter.cos1_4;
		p8 = pp8 + pp9;
		p9 = (pp8 - pp9) * SynthesisFilter.cos1_4;
		p10 = pp10 + pp11;
		p11 = (pp10 - pp11) * SynthesisFilter.cos1_4;
		p12 = pp12 + pp13;
		p13 = (pp12 - pp13) * SynthesisFilter.cos1_4;
		p14 = pp14 + pp15;
		p15 = (pp14 - pp15) * SynthesisFilter.cos1_4;
		var tmp1;
		new_v19 = -(new_v4 = (new_v12 = p7) + p5) - p6;
		new_v27 = -p6 - p7 - p4;
		new_v6 = (new_v10 = (new_v14 = p15) + p11) + p13;
		new_v17 = -(new_v2 = p15 + p13 + p9) - p14;
		new_v21 = (tmp1 = -p14 - p15 - p10 - p11) - p13;
		new_v29 = -p14 - p15 - p12 - p8;
		new_v25 = tmp1 - p12;
		new_v31 = -p0;
		new_v0 = p1;
		new_v23 = -(new_v8 = p3) - p2;
		p0 = (s0 - s31) * SynthesisFilter.cos1_64;
		p1 = (s1 - s30) * SynthesisFilter.cos3_64;
		p2 = (s2 - s29) * SynthesisFilter.cos5_64;
		p3 = (s3 - s28) * SynthesisFilter.cos7_64;
		p4 = (s4 - s27) * SynthesisFilter.cos9_64;
		p5 = (s5 - s26) * SynthesisFilter.cos11_64;
		p6 = (s6 - s25) * SynthesisFilter.cos13_64;
		p7 = (s7 - s24) * SynthesisFilter.cos15_64;
		p8 = (s8 - s23) * SynthesisFilter.cos17_64;
		p9 = (s9 - s22) * SynthesisFilter.cos19_64;
		p10 = (s10 - s21) * SynthesisFilter.cos21_64;
		p11 = (s11 - s20) * SynthesisFilter.cos23_64;
		p12 = (s12 - s19) * SynthesisFilter.cos25_64;
		p13 = (s13 - s18) * SynthesisFilter.cos27_64;
		p14 = (s14 - s17) * SynthesisFilter.cos29_64;
		p15 = (s15 - s16) * SynthesisFilter.cos31_64;
		pp0 = p0 + p15;
		pp1 = p1 + p14;
		pp2 = p2 + p13;
		pp3 = p3 + p12;
		pp4 = p4 + p11;
		pp5 = p5 + p10;
		pp6 = p6 + p9;
		pp7 = p7 + p8;
		pp8 = (p0 - p15) * SynthesisFilter.cos1_32;
		pp9 = (p1 - p14) * SynthesisFilter.cos3_32;
		pp10 = (p2 - p13) * SynthesisFilter.cos5_32;
		pp11 = (p3 - p12) * SynthesisFilter.cos7_32;
		pp12 = (p4 - p11) * SynthesisFilter.cos9_32;
		pp13 = (p5 - p10) * SynthesisFilter.cos11_32;
		pp14 = (p6 - p9) * SynthesisFilter.cos13_32;
		pp15 = (p7 - p8) * SynthesisFilter.cos15_32;
		p0 = pp0 + pp7;
		p1 = pp1 + pp6;
		p2 = pp2 + pp5;
		p3 = pp3 + pp4;
		p4 = (pp0 - pp7) * SynthesisFilter.cos1_16;
		p5 = (pp1 - pp6) * SynthesisFilter.cos3_16;
		p6 = (pp2 - pp5) * SynthesisFilter.cos5_16;
		p7 = (pp3 - pp4) * SynthesisFilter.cos7_16;
		p8 = pp8 + pp15;
		p9 = pp9 + pp14;
		p10 = pp10 + pp13;
		p11 = pp11 + pp12;
		p12 = (pp8 - pp15) * SynthesisFilter.cos1_16;
		p13 = (pp9 - pp14) * SynthesisFilter.cos3_16;
		p14 = (pp10 - pp13) * SynthesisFilter.cos5_16;
		p15 = (pp11 - pp12) * SynthesisFilter.cos7_16;
		pp0 = p0 + p3;
		pp1 = p1 + p2;
		pp2 = (p0 - p3) * SynthesisFilter.cos1_8;
		pp3 = (p1 - p2) * SynthesisFilter.cos3_8;
		pp4 = p4 + p7;
		pp5 = p5 + p6;
		pp6 = (p4 - p7) * SynthesisFilter.cos1_8;
		pp7 = (p5 - p6) * SynthesisFilter.cos3_8;
		pp8 = p8 + p11;
		pp9 = p9 + p10;
		pp10 = (p8 - p11) * SynthesisFilter.cos1_8;
		pp11 = (p9 - p10) * SynthesisFilter.cos3_8;
		pp12 = p12 + p15;
		pp13 = p13 + p14;
		pp14 = (p12 - p15) * SynthesisFilter.cos1_8;
		pp15 = (p13 - p14) * SynthesisFilter.cos3_8;
		p0 = pp0 + pp1;
		p1 = (pp0 - pp1) * SynthesisFilter.cos1_4;
		p2 = pp2 + pp3;
		p3 = (pp2 - pp3) * SynthesisFilter.cos1_4;
		p4 = pp4 + pp5;
		p5 = (pp4 - pp5) * SynthesisFilter.cos1_4;
		p6 = pp6 + pp7;
		p7 = (pp6 - pp7) * SynthesisFilter.cos1_4;
		p8 = pp8 + pp9;
		p9 = (pp8 - pp9) * SynthesisFilter.cos1_4;
		p10 = pp10 + pp11;
		p11 = (pp10 - pp11) * SynthesisFilter.cos1_4;
		p12 = pp12 + pp13;
		p13 = (pp12 - pp13) * SynthesisFilter.cos1_4;
		p14 = pp14 + pp15;
		p15 = (pp14 - pp15) * SynthesisFilter.cos1_4;
		var tmp2;
		new_v5 = (new_v11 = (new_v13 = (new_v15 = p15) + p7) + p11) + p5 + p13;
		new_v7 = (new_v9 = p15 + p11 + p3) + p13;
		new_v16 = -(new_v1 = (tmp1 = p13 + p15 + p9) + p1) - p14;
		new_v18 = -(new_v3 = tmp1 + p5 + p7) - p6 - p14;
		new_v22 = (tmp1 = -p10 - p11 - p14 - p15) - p13 - p2 - p3;
		new_v20 = tmp1 - p13 - p5 - p6 - p7;
		new_v24 = tmp1 - p12 - p2 - p3;
		new_v26 = tmp1 - p12 - (tmp2 = p4 + p6 + p7);
		new_v30 = (tmp1 = -p8 - p12 - p14 - p15) - p0;
		new_v28 = tmp1 - tmp2;
		var dest = this.actual_v;
		var pos = this.actual_write_pos;
		dest[0 + pos] = new_v0;
		dest[16 + pos] = new_v1;
		dest[32 + pos] = new_v2;
		dest[48 + pos] = new_v3;
		dest[64 + pos] = new_v4;
		dest[80 + pos] = new_v5;
		dest[96 + pos] = new_v6;
		dest[112 + pos] = new_v7;
		dest[128 + pos] = new_v8;
		dest[144 + pos] = new_v9;
		dest[160 + pos] = new_v10;
		dest[176 + pos] = new_v11;
		dest[192 + pos] = new_v12;
		dest[208 + pos] = new_v13;
		dest[224 + pos] = new_v14;
		dest[240 + pos] = new_v15;
		dest[256 + pos] = 0.0;
		dest[272 + pos] = -new_v15;
		dest[288 + pos] = -new_v14;
		dest[304 + pos] = -new_v13;
		dest[320 + pos] = -new_v12;
		dest[336 + pos] = -new_v11;
		dest[352 + pos] = -new_v10;
		dest[368 + pos] = -new_v9;
		dest[384 + pos] = -new_v8;
		dest[400 + pos] = -new_v7;
		dest[416 + pos] = -new_v6;
		dest[432 + pos] = -new_v5;
		dest[448 + pos] = -new_v4;
		dest[464 + pos] = -new_v3;
		dest[480 + pos] = -new_v2;
		dest[496 + pos] = -new_v1;
		dest = (this.actual_v === this.v1) ? this.v2 : this.v1;
		dest[0 + pos] = -new_v0;
		dest[16 + pos] = new_v16;
		dest[32 + pos] = new_v17;
		dest[48 + pos] = new_v18;
		dest[64 + pos] = new_v19;
		dest[80 + pos] = new_v20;
		dest[96 + pos] = new_v21;
		dest[112 + pos] = new_v22;
		dest[128 + pos] = new_v23;
		dest[144 + pos] = new_v24;
		dest[160 + pos] = new_v25;
		dest[176 + pos] = new_v26;
		dest[192 + pos] = new_v27;
		dest[208 + pos] = new_v28;
		dest[224 + pos] = new_v29;
		dest[240 + pos] = new_v30;
		dest[256 + pos] = new_v31;
		dest[272 + pos] = new_v30;
		dest[288 + pos] = new_v29;
		dest[304 + pos] = new_v28;
		dest[320 + pos] = new_v27;
		dest[336 + pos] = new_v26;
		dest[352 + pos] = new_v25;
		dest[368 + pos] = new_v24;
		dest[384 + pos] = new_v23;
		dest[400 + pos] = new_v22;
		dest[416 + pos] = new_v21;
		dest[432 + pos] = new_v20;
		dest[448 + pos] = new_v19;
		dest[464 + pos] = new_v18;
		dest[480 + pos] = new_v17;
		dest[496 + pos] = new_v16;
	};
	SynthesisFilter.prototype.compute_pcm_samples0 = function(buffer) {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var pcm_sample;
			var dp = SynthesisFilter.d16[i];
			pcm_sample = ((vp[0 + dvp] * dp[0]) + (vp[15 + dvp] * dp[1]) + (vp[14 + dvp] * dp[2]) + (vp[13 + dvp] * dp[3]) + (vp[12 + dvp] * dp[4]) + (vp[11 + dvp] * dp[5]) + (vp[10 + dvp] * dp[6]) + (vp[9 + dvp] * dp[7]) + (vp[8 + dvp] * dp[8]) + (vp[7 + dvp] * dp[9]) + (vp[6 + dvp] * dp[10]) + (vp[5 + dvp] * dp[11]) + (vp[4 + dvp] * dp[12]) + (vp[3 + dvp] * dp[13]) + (vp[2 + dvp] * dp[14]) + (vp[1 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples1 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[1 + dvp] * dp[0]) + (vp[0 + dvp] * dp[1]) + (vp[15 + dvp] * dp[2]) + (vp[14 + dvp] * dp[3]) + (vp[13 + dvp] * dp[4]) + (vp[12 + dvp] * dp[5]) + (vp[11 + dvp] * dp[6]) + (vp[10 + dvp] * dp[7]) + (vp[9 + dvp] * dp[8]) + (vp[8 + dvp] * dp[9]) + (vp[7 + dvp] * dp[10]) + (vp[6 + dvp] * dp[11]) + (vp[5 + dvp] * dp[12]) + (vp[4 + dvp] * dp[13]) + (vp[3 + dvp] * dp[14]) + (vp[2 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples2 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[2 + dvp] * dp[0]) + (vp[1 + dvp] * dp[1]) + (vp[0 + dvp] * dp[2]) + (vp[15 + dvp] * dp[3]) + (vp[14 + dvp] * dp[4]) + (vp[13 + dvp] * dp[5]) + (vp[12 + dvp] * dp[6]) + (vp[11 + dvp] * dp[7]) + (vp[10 + dvp] * dp[8]) + (vp[9 + dvp] * dp[9]) + (vp[8 + dvp] * dp[10]) + (vp[7 + dvp] * dp[11]) + (vp[6 + dvp] * dp[12]) + (vp[5 + dvp] * dp[13]) + (vp[4 + dvp] * dp[14]) + (vp[3 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples3 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[3 + dvp] * dp[0]) + (vp[2 + dvp] * dp[1]) + (vp[1 + dvp] * dp[2]) + (vp[0 + dvp] * dp[3]) + (vp[15 + dvp] * dp[4]) + (vp[14 + dvp] * dp[5]) + (vp[13 + dvp] * dp[6]) + (vp[12 + dvp] * dp[7]) + (vp[11 + dvp] * dp[8]) + (vp[10 + dvp] * dp[9]) + (vp[9 + dvp] * dp[10]) + (vp[8 + dvp] * dp[11]) + (vp[7 + dvp] * dp[12]) + (vp[6 + dvp] * dp[13]) + (vp[5 + dvp] * dp[14]) + (vp[4 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples4 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[4 + dvp] * dp[0]) + (vp[3 + dvp] * dp[1]) + (vp[2 + dvp] * dp[2]) + (vp[1 + dvp] * dp[3]) + (vp[0 + dvp] * dp[4]) + (vp[15 + dvp] * dp[5]) + (vp[14 + dvp] * dp[6]) + (vp[13 + dvp] * dp[7]) + (vp[12 + dvp] * dp[8]) + (vp[11 + dvp] * dp[9]) + (vp[10 + dvp] * dp[10]) + (vp[9 + dvp] * dp[11]) + (vp[8 + dvp] * dp[12]) + (vp[7 + dvp] * dp[13]) + (vp[6 + dvp] * dp[14]) + (vp[5 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples5 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[5 + dvp] * dp[0]) + (vp[4 + dvp] * dp[1]) + (vp[3 + dvp] * dp[2]) + (vp[2 + dvp] * dp[3]) + (vp[1 + dvp] * dp[4]) + (vp[0 + dvp] * dp[5]) + (vp[15 + dvp] * dp[6]) + (vp[14 + dvp] * dp[7]) + (vp[13 + dvp] * dp[8]) + (vp[12 + dvp] * dp[9]) + (vp[11 + dvp] * dp[10]) + (vp[10 + dvp] * dp[11]) + (vp[9 + dvp] * dp[12]) + (vp[8 + dvp] * dp[13]) + (vp[7 + dvp] * dp[14]) + (vp[6 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples6 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[6 + dvp] * dp[0]) + (vp[5 + dvp] * dp[1]) + (vp[4 + dvp] * dp[2]) + (vp[3 + dvp] * dp[3]) + (vp[2 + dvp] * dp[4]) + (vp[1 + dvp] * dp[5]) + (vp[0 + dvp] * dp[6]) + (vp[15 + dvp] * dp[7]) + (vp[14 + dvp] * dp[8]) + (vp[13 + dvp] * dp[9]) + (vp[12 + dvp] * dp[10]) + (vp[11 + dvp] * dp[11]) + (vp[10 + dvp] * dp[12]) + (vp[9 + dvp] * dp[13]) + (vp[8 + dvp] * dp[14]) + (vp[7 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples7 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[7 + dvp] * dp[0]) + (vp[6 + dvp] * dp[1]) + (vp[5 + dvp] * dp[2]) + (vp[4 + dvp] * dp[3]) + (vp[3 + dvp] * dp[4]) + (vp[2 + dvp] * dp[5]) + (vp[1 + dvp] * dp[6]) + (vp[0 + dvp] * dp[7]) + (vp[15 + dvp] * dp[8]) + (vp[14 + dvp] * dp[9]) + (vp[13 + dvp] * dp[10]) + (vp[12 + dvp] * dp[11]) + (vp[11 + dvp] * dp[12]) + (vp[10 + dvp] * dp[13]) + (vp[9 + dvp] * dp[14]) + (vp[8 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples8 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[8 + dvp] * dp[0]) + (vp[7 + dvp] * dp[1]) + (vp[6 + dvp] * dp[2]) + (vp[5 + dvp] * dp[3]) + (vp[4 + dvp] * dp[4]) + (vp[3 + dvp] * dp[5]) + (vp[2 + dvp] * dp[6]) + (vp[1 + dvp] * dp[7]) + (vp[0 + dvp] * dp[8]) + (vp[15 + dvp] * dp[9]) + (vp[14 + dvp] * dp[10]) + (vp[13 + dvp] * dp[11]) + (vp[12 + dvp] * dp[12]) + (vp[11 + dvp] * dp[13]) + (vp[10 + dvp] * dp[14]) + (vp[9 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples9 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[9 + dvp] * dp[0]) +(vp[8 + dvp] * dp[1]) +(vp[7 + dvp] * dp[2]) +(vp[6 + dvp] * dp[3]) +(vp[5 + dvp] * dp[4]) +(vp[4 + dvp] * dp[5]) +(vp[3 + dvp] * dp[6]) +(vp[2 + dvp] * dp[7]) +(vp[1 + dvp] * dp[8]) +(vp[0 + dvp] * dp[9]) +(vp[15 + dvp] * dp[10]) +(vp[14 + dvp] * dp[11]) +(vp[13 + dvp] * dp[12]) +(vp[12 + dvp] * dp[13]) +(vp[11 + dvp] * dp[14]) +(vp[10 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples10 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[10 + dvp] * dp[0]) + (vp[9 + dvp] * dp[1]) + (vp[8 + dvp] * dp[2]) + (vp[7 + dvp] * dp[3]) + (vp[6 + dvp] * dp[4]) + (vp[5 + dvp] * dp[5]) + (vp[4 + dvp] * dp[6]) + (vp[3 + dvp] * dp[7]) + (vp[2 + dvp] * dp[8]) + (vp[1 + dvp] * dp[9]) + (vp[0 + dvp] * dp[10]) + (vp[15 + dvp] * dp[11]) + (vp[14 + dvp] * dp[12]) + (vp[13 + dvp] * dp[13]) + (vp[12 + dvp] * dp[14]) + (vp[11 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples11 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[11 + dvp] * dp[0]) + (vp[10 + dvp] * dp[1]) + (vp[9 + dvp] * dp[2]) + (vp[8 + dvp] * dp[3]) + (vp[7 + dvp] * dp[4]) + (vp[6 + dvp] * dp[5]) + (vp[5 + dvp] * dp[6]) + (vp[4 + dvp] * dp[7]) + (vp[3 + dvp] * dp[8]) + (vp[2 + dvp] * dp[9]) + (vp[1 + dvp] * dp[10]) + (vp[0 + dvp] * dp[11]) + (vp[15 + dvp] * dp[12]) + (vp[14 + dvp] * dp[13]) + (vp[13 + dvp] * dp[14]) + (vp[12 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples12 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[12 + dvp] * dp[0]) + (vp[11 + dvp] * dp[1]) + (vp[10 + dvp] * dp[2]) + (vp[9 + dvp] * dp[3]) + (vp[8 + dvp] * dp[4]) + (vp[7 + dvp] * dp[5]) + (vp[6 + dvp] * dp[6]) + (vp[5 + dvp] * dp[7]) + (vp[4 + dvp] * dp[8]) + (vp[3 + dvp] * dp[9]) + (vp[2 + dvp] * dp[10]) + (vp[1 + dvp] * dp[11]) + (vp[0 + dvp] * dp[12]) + (vp[15 + dvp] * dp[13]) + (vp[14 + dvp] * dp[14]) + (vp[13 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples13 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[13 + dvp] * dp[0]) + (vp[12 + dvp] * dp[1]) + (vp[11 + dvp] * dp[2]) + (vp[10 + dvp] * dp[3]) + (vp[9 + dvp] * dp[4]) + (vp[8 + dvp] * dp[5]) + (vp[7 + dvp] * dp[6]) + (vp[6 + dvp] * dp[7]) + (vp[5 + dvp] * dp[8]) + (vp[4 + dvp] * dp[9]) + (vp[3 + dvp] * dp[10]) + (vp[2 + dvp] * dp[11]) + (vp[1 + dvp] * dp[12]) + (vp[0 + dvp] * dp[13]) + (vp[15 + dvp] * dp[14]) + (vp[14 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples14 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var dp = SynthesisFilter.d16[i];
			var pcm_sample;
			pcm_sample = ((vp[14 + dvp] * dp[0]) + (vp[13 + dvp] * dp[1]) + (vp[12 + dvp] * dp[2]) + (vp[11 + dvp] * dp[3]) + (vp[10 + dvp] * dp[4]) + (vp[9 + dvp] * dp[5]) + (vp[8 + dvp] * dp[6]) + (vp[7 + dvp] * dp[7]) + (vp[6 + dvp] * dp[8]) + (vp[5 + dvp] * dp[9]) + (vp[4 + dvp] * dp[10]) + (vp[3 + dvp] * dp[11]) + (vp[2 + dvp] * dp[12]) + (vp[1 + dvp] * dp[13]) + (vp[0 + dvp] * dp[14]) + (vp[15 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples15 = function() {
		var vp = this.actual_v;
		var tmpOut = this._tmpOut;
		var dvp = 0;
		for (var i = 0; i < 32; i++) {
			var pcm_sample;
			var dp = SynthesisFilter.d16[i];
			pcm_sample = ((vp[15 + dvp] * dp[0]) + (vp[14 + dvp] * dp[1]) + (vp[13 + dvp] * dp[2]) + (vp[12 + dvp] * dp[3]) + (vp[11 + dvp] * dp[4]) + (vp[10 + dvp] * dp[5]) + (vp[9 + dvp] * dp[6]) + (vp[8 + dvp] * dp[7]) + (vp[7 + dvp] * dp[8]) + (vp[6 + dvp] * dp[9]) + (vp[5 + dvp] * dp[10]) + (vp[4 + dvp] * dp[11]) + (vp[3 + dvp] * dp[12]) + (vp[2 + dvp] * dp[13]) + (vp[1 + dvp] * dp[14]) + (vp[0 + dvp] * dp[15])) * this.scalefactor;
			tmpOut[i] = pcm_sample;
			dvp += 16;
		}
	};
	SynthesisFilter.prototype.compute_pcm_samples = function(buffer) {
		switch (this.actual_write_pos) {
			case 0:
				this.compute_pcm_samples0(buffer);
				break;
			case 1:
				this.compute_pcm_samples1(buffer);
				break;
			case 2:
				this.compute_pcm_samples2(buffer);
				break;
			case 3:
				this.compute_pcm_samples3(buffer);
				break;
			case 4:
				this.compute_pcm_samples4(buffer);
				break;
			case 5:
				this.compute_pcm_samples5(buffer);
				break;
			case 6:
				this.compute_pcm_samples6(buffer);
				break;
			case 7:
				this.compute_pcm_samples7(buffer);
				break;
			case 8:
				this.compute_pcm_samples8(buffer);
				break;
			case 9:
				this.compute_pcm_samples9(buffer);
				break;
			case 10:
				this.compute_pcm_samples10(buffer);
				break;
			case 11:
				this.compute_pcm_samples11(buffer);
				break;
			case 12:
				this.compute_pcm_samples12(buffer);
				break;
			case 13:
				this.compute_pcm_samples13(buffer);
				break;
			case 14:
				this.compute_pcm_samples14(buffer);
				break;
			case 15:
				this.compute_pcm_samples15(buffer);
				break;
		}
		if (buffer != null) {
			buffer.appendSamples(this.channel, this._tmpOut);
		}
	};
	SynthesisFilter.prototype.calculate_pcm_samples = function(buffer) {
		this.compute_new_v();
		this.compute_pcm_samples(buffer);
		this.actual_write_pos = (this.actual_write_pos + 1) & 0xf;
		this.actual_v = (this.actual_v === this.v1) ? this.v2 : this.v1;
		for (var p = 0; p < 32; p++)
			this.samples[p] = 0.0;
	};
	SynthesisFilter.MY_PI = 3.14159265358979323846;
	SynthesisFilter.cos1_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI / 64.0)));
	SynthesisFilter.cos3_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 3.0 / 64.0)));
	SynthesisFilter.cos5_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 5.0 / 64.0)));
	SynthesisFilter.cos7_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 7.0 / 64.0)));
	SynthesisFilter.cos9_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 9.0 / 64.0)));
	SynthesisFilter.cos11_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 11.0 / 64.0)));
	SynthesisFilter.cos13_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 13.0 / 64.0)));
	SynthesisFilter.cos15_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 15.0 / 64.0)));
	SynthesisFilter.cos17_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 17.0 / 64.0)));
	SynthesisFilter.cos19_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 19.0 / 64.0)));
	SynthesisFilter.cos21_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 21.0 / 64.0)));
	SynthesisFilter.cos23_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 23.0 / 64.0)));
	SynthesisFilter.cos25_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 25.0 / 64.0)));
	SynthesisFilter.cos27_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 27.0 / 64.0)));
	SynthesisFilter.cos29_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 29.0 / 64.0)));
	SynthesisFilter.cos31_64 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 31.0 / 64.0)));
	SynthesisFilter.cos1_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI/ 32.0)));
	SynthesisFilter.cos3_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI* 3.0 / 32.0)));
	SynthesisFilter.cos5_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI* 5.0 / 32.0)));
	SynthesisFilter.cos7_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI* 7.0 / 32.0)));
	SynthesisFilter.cos9_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI* 9.0 / 32.0)));
	SynthesisFilter.cos11_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 11.0 / 32.0)));
	SynthesisFilter.cos13_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 13.0 / 32.0)));
	SynthesisFilter.cos15_32 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 15.0 / 32.0)));
	SynthesisFilter.cos1_16 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI / 16.0)));
	SynthesisFilter.cos3_16 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 3.0 / 16.0)));
	SynthesisFilter.cos5_16 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 5.0 / 16.0)));
	SynthesisFilter.cos7_16 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 7.0 / 16.0)));
	SynthesisFilter.cos1_8 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI / 8.0)));
	SynthesisFilter.cos3_8 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI * 3.0 / 8.0)));
	SynthesisFilter.cos1_4 = (1.0 / (2.0 * Math.cos(SynthesisFilter.MY_PI / 4.0)));
	const gr_info_s = function() {
		this.part2_3_length = 0;
		this.big_values = 0;
		this.global_gain = 0;
		this.scalefac_compress = 0;
		this.window_switching_flag = 0;
		this.block_type = 0;
		this.mixed_block_flag = 0;
		this.table_select = new Int32Array(3);
		this.subblock_gain = new Int32Array(3);
		this.region0_count = 0;
		this.region1_count = 0;
		this.preflag = 0;
		this.scalefac_scale = 0;
		this.count1table_select = 0;
	}
	const temporaire = function() {
		this.scfsi = new Int32Array(4);
		this.gr = [new gr_info_s(), new gr_info_s()];
	}
	const temporaire2 = function() {
		this.l = new Int32Array(23);
		this.s = [new Int32Array(13), new Int32Array(13), new Int32Array(13)];
	}
	const III_side_info_t = function() {
		this.main_data_begin = 0;
		this.private_bits = 0;
		this.ch = [new temporaire(), new temporaire()];
	}
	const SBI = function(thel, thes) {
		this.l = thel;
		this.s = thes;
	}
	const Sftable = function(thel, thes) {
		this.l = thel;
		this.s = thes;
	}
	const MP3Layer3 = function(stream0, header0, filtera, filterb, buffer0, which_ch0) {
		huffcodetab.initHuff();

		this.checkSumHuff = 0;

		this.is_1d = new Int32Array(MP3Layer3.SBLIMIT * MP3Layer3.SSLIMIT + 4);
		this.ro = new Array(2);
		this.lr = new Array(2);
		this.prevblck = new Array(2);
		this.k = new Array(2);
		for (var i = 0; i < 2; i++) {
			this.ro[i] = new Array(MP3Layer3.SBLIMIT);
			this.lr[i] = new Array(MP3Layer3.SBLIMIT);
			this.prevblck[i] = new Float32Array(MP3Layer3.SBLIMIT * MP3Layer3.SSLIMIT);
			this.k[i] = new Float32Array(MP3Layer3.SBLIMIT * MP3Layer3.SSLIMIT);
			for (var j = 0; j < MP3Layer3.SBLIMIT; j++) {
				this.ro[i][j] = new Float32Array(MP3Layer3.SSLIMIT);
				this.lr[i][j] = new Float32Array(MP3Layer3.SSLIMIT);
			}
		}
		this.out_1d = new Float32Array(MP3Layer3.SBLIMIT * MP3Layer3.SSLIMIT);
		this.nonzero = new Int32Array(2);

		this.III_scalefac_t = new Array(2);
		this.III_scalefac_t[0] = new temporaire2();
		this.III_scalefac_t[1] = new temporaire2();
		this.scalefac = this.III_scalefac_t;

		MP3Layer3.sfBandIndex = new Array(9);
		var l0 = [0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576];
		var s0 = [0, 4, 8, 12, 18, 24, 32, 42, 56, 74, 100, 132, 174, 192];
		var l1 = [0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 114, 136, 162, 194, 232, 278, 330, 394, 464, 540, 576];
		var s1 = [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 136, 180, 192];
		var l2 = [0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576];
		var s2 = [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192];

		var l3 = [0, 4, 8, 12, 16, 20, 24, 30, 36, 44, 52, 62, 74, 90, 110, 134, 162, 196, 238, 288, 342, 418, 576];
		var s3 = [0, 4, 8, 12, 16, 22, 30, 40, 52, 66, 84, 106, 136, 192];
		var l4 = [0, 4, 8, 12, 16, 20, 24, 30, 36, 42, 50, 60, 72, 88, 106, 128, 156, 190, 230, 276, 330, 384, 576];
		var s4 = [0, 4, 8, 12, 16, 22, 28, 38, 50, 64, 80, 100, 126, 192];
		var l5 = [0, 4, 8, 12, 16, 20, 24, 30, 36, 44, 54, 66, 82, 102, 126, 156, 194, 240, 296, 364, 448, 550, 576];
		var s5 = [0, 4, 8, 12, 16, 22, 30, 42, 58, 78, 104, 138, 180, 192];

		var l6 = [0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576];
		var s6 = [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192];
		var l7 = [0, 6, 12, 18, 24, 30, 36, 44, 54, 66, 80, 96, 116, 140, 168, 200, 238, 284, 336, 396, 464, 522, 576];
		var s7 = [0, 4, 8, 12, 18, 26, 36, 48, 62, 80, 104, 134, 174, 192];
		var l8 = [0, 12, 24, 36, 48, 60, 72, 88, 108, 132, 160, 192, 232, 280, 336, 400, 476, 566, 568, 570, 572, 574, 576];
		var s8 = [0, 8, 16, 24, 36, 52, 72, 96, 124, 160, 162, 164, 166, 192];

		MP3Layer3.sfBandIndex[0] = new SBI(l0, s0);
		MP3Layer3.sfBandIndex[1] = new SBI(l1, s1);
		MP3Layer3.sfBandIndex[2] = new SBI(l2, s2);

		MP3Layer3.sfBandIndex[3] = new SBI(l3, s3);
		MP3Layer3.sfBandIndex[4] = new SBI(l4, s4);
		MP3Layer3.sfBandIndex[5] = new SBI(l5, s5);
		// SZD: MPEG2.5
		MP3Layer3.sfBandIndex[6] = new SBI(l6, s6);
		MP3Layer3.sfBandIndex[7] = new SBI(l7, s7);
		MP3Layer3.sfBandIndex[8] = new SBI(l8, s8);

		if (MP3Layer3.reorder_table == null) { // SZD: generate LUT
			MP3Layer3.reorder_table = new Array(9);
			for (var i = 0; i < 9; i++)
				MP3Layer3.reorder_table[i] = MP3Layer3.reorder(MP3Layer3.sfBandIndex[i].s);
		}

		var ll0 = [0, 6, 11, 16, 21];
		var ss0 = [0, 6, 12];
		this.sftable = new Sftable(ll0, ss0);

		this.scalefac_buffer = new Int32Array(54);

		this.stream = stream0;
		this.header = header0;
		this.filter1 = filtera;
		this.filter2 = filterb;
		this.buffer = buffer0;
		this.which_channels = which_ch0;

		this.first_channel = 0;
		this.last_channel = 0;

		this.frame_start = 0;
		this.channels = (this.header.mode() == MP3Header.SINGLE_CHANNEL) ? 1 : 2;
		this.max_gr = (this.header.version() == MP3Header.MPEG1) ? 2 : 1;
		this.sfreq = (this.header.sample_frequency() + ((this.header.version() == MP3Header.MPEG1) ? 3 : (this.header.version() == MP3Header.MPEG25_LSF) ? 6 : 0)) | 0;
		
		if (this.channels == 2) {
			this.first_channel = 0;
			this.last_channel = 1;
		} else {
			this.first_channel = this.last_channel = 0;
		}

		this.part2_start = 0;

		for (var ch = 0; ch < 2; ch++)
			for (var j = 0; j < 576; j++)
				this.prevblck[ch][j] = 0.0;

		this.nonzero[0] = this.nonzero[1] = 576;

		this.br = new BitReserve();
		this.si = new III_side_info_t();

		this.samples1 = new Float32Array(32);
		this.samples2 = new Float32Array(32);

		this.new_slen = new Int32Array(4);
	}
	MP3Layer3.reorder_table = null;
	MP3Layer3.reorder = function(scalefac_band) {
		var j = 0;
		var ix = new Int32Array(576);
		for (var sfb = 0; sfb < 13; sfb++) {
			var start = scalefac_band[sfb];
			var end = scalefac_band[sfb + 1];
			for (var _window = 0; _window < 3; _window++)
				for (var i = start; i < end; i++)
					ix[3 * i + _window] = j++;
		}
		return ix;
	}
	MP3Layer3.SSLIMIT = 18;
	MP3Layer3.SBLIMIT = 32;
	MP3Layer3.slen = [
		[0, 0, 0, 0, 3, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4],
		[0, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 1, 2, 3, 2, 3],
	];
	MP3Layer3.pretab = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 3, 2, 0];
	MP3Layer3.d43 = 4 / 3;
	MP3Layer3.t_43 = (function() {
		var t43 = new Float32Array(8192);
		var d43 = (4.0 / 3.0);
		for (var i = 0; i < 8192; i++) {
			t43[i] = Math.pow(i, d43);
		}
		return t43;
	}());
	MP3Layer3.prototype.decodeFrame = function() {
		this.decode();
	}
	MP3Layer3.prototype.decode = function() {
		var br = this.br;
		var out_1d = this.out_1d;
		var nSlots = this.header.slots();
		var flush_main = 0;
		var gr = 0, ch = 0, ss = 0, sb = 0, sb18 = 0;
		var main_data_end = 0;
		var bytes_to_discard = 0;
		var i = 0;
		if (this.header.crc() == 0) {
			this.stream.get_bits(16);
		}
		this.get_side_info();
		for (i = 0; i < nSlots; i++) this.br.hputbuf(this.stream.get_bits(8));
		main_data_end = this.br.hsstell() >>> 3;
		if ((flush_main = (this.br.hsstell() & 7)) != 0) {
			this.br.hgetbits(8 - flush_main);
			main_data_end++;
		}
		bytes_to_discard = this.frame_start - main_data_end - this.si.main_data_begin;
		this.frame_start += nSlots;
		if (bytes_to_discard < 0) {
			return;
		}
		if (main_data_end > 4096) {
			this.frame_start -= 4096;
			this.br.rewindNbytes(4096);
		}
		for (; bytes_to_discard > 0; bytes_to_discard--) br.hgetbits(8);
		for (gr = 0; gr < this.max_gr; gr++) {
			for (ch = 0; ch < this.channels; ch++) {
				this.part2_start = br.hsstell();
				if (this.header.version() == MP3Header.MPEG1) this.get_scale_factors(ch, gr);
				else this.get_LSF_scale_factors(ch, gr);
				this.huffman_decode(ch, gr);
				this.dequantize_sample(this.ro[ch], ch, gr);
			}
			this.stereo(gr);
			for (ch = this.first_channel; ch <= this.last_channel; ch++) {
				this.reorder(this.lr[ch], ch, gr);
				this.antialias(ch, gr);
				this.hybrid(ch, gr);
				for (sb18 = 18; sb18 < 576; sb18 += 36)
					for (ss = 1; ss < MP3Layer3.SSLIMIT; ss += 2)
						out_1d[sb18 + ss] = -out_1d[sb18 + ss];
				if (ch == 0) {
					for (ss = 0; ss < MP3Layer3.SSLIMIT; ss++) {
						sb = 0;
						for (sb18 = 0; sb18 < 576; sb18 += 18) {
							this.samples1[sb] = out_1d[sb18 + ss];
							sb++;
						}
						this.filter1.input_samples(this.samples1);
						this.filter1.calculate_pcm_samples(this.buffer);
					}
				} else {
					for (ss = 0; ss < MP3Layer3.SSLIMIT; ss++) {
						sb = 0;
						for (sb18 = 0; sb18 < 576; sb18 += 18) {
							this.samples2[sb] = out_1d[sb18 + ss];
							sb++;
						}
						this.filter2.input_samples(this.samples2);
						this.filter2.calculate_pcm_samples(this.buffer);
					}
				}
			}
		}
	}
	MP3Layer3.prototype.get_side_info = function() {
		var channels = this.channels;
		var si = this.si;
		var stream = this.stream;
		var ch = 0, gr = 0;
		if (this.header.version() == MP3Header.MPEG1) {
			si.main_data_begin = stream.get_bits(9);
			if (channels == 1) si.private_bits = stream.get_bits(5);
			else si.private_bits = stream.get_bits(3);
			for (ch = 0; ch < channels; ch++) {
				si.ch[ch].scfsi[0] = stream.get_bits(1);
				si.ch[ch].scfsi[1] = stream.get_bits(1);
				si.ch[ch].scfsi[2] = stream.get_bits(1);
				si.ch[ch].scfsi[3] = stream.get_bits(1);
			}
			for (gr = 0; gr < 2; gr++) {
				for (ch = 0; ch < channels; ch++) {
					si.ch[ch].gr[gr].part2_3_length = stream.get_bits(12);
					si.ch[ch].gr[gr].big_values = stream.get_bits(9);
					si.ch[ch].gr[gr].global_gain = stream.get_bits(8);
					si.ch[ch].gr[gr].scalefac_compress = stream.get_bits(4);
					si.ch[ch].gr[gr].window_switching_flag = stream.get_bits(1);
					if ((si.ch[ch].gr[gr].window_switching_flag) != 0) {
						si.ch[ch].gr[gr].block_type = stream.get_bits(2);
						si.ch[ch].gr[gr].mixed_block_flag = stream.get_bits(1);
						si.ch[ch].gr[gr].table_select[0] = stream.get_bits(5);
						si.ch[ch].gr[gr].table_select[1] = stream.get_bits(5);
						si.ch[ch].gr[gr].subblock_gain[0] = stream.get_bits(3);
						si.ch[ch].gr[gr].subblock_gain[1] = stream.get_bits(3);
						si.ch[ch].gr[gr].subblock_gain[2] = stream.get_bits(3);
						if (si.ch[ch].gr[gr].block_type == 0) {
							return false;
						} else if (si.ch[ch].gr[gr].block_type == 2 && si.ch[ch].gr[gr].mixed_block_flag == 0) {
							si.ch[ch].gr[gr].region0_count = 8;
						} else {
							si.ch[ch].gr[gr].region0_count = 7;
						}
						si.ch[ch].gr[gr].region1_count = 20 - si.ch[ch].gr[gr].region0_count;
					} else {
						si.ch[ch].gr[gr].table_select[0] = stream.get_bits(5);
						si.ch[ch].gr[gr].table_select[1] = stream.get_bits(5);
						si.ch[ch].gr[gr].table_select[2] = stream.get_bits(5);
						si.ch[ch].gr[gr].region0_count = stream.get_bits(4);
						si.ch[ch].gr[gr].region1_count = stream.get_bits(3);
						si.ch[ch].gr[gr].block_type = 0;
					}
					si.ch[ch].gr[gr].preflag = stream.get_bits(1);
					si.ch[ch].gr[gr].scalefac_scale = stream.get_bits(1);
					si.ch[ch].gr[gr].count1table_select = stream.get_bits(1);
				}
			}
		} else {
			si.main_data_begin = stream.get_bits(8);
			if (channels == 1) si.private_bits = stream.get_bits(1);
			else si.private_bits = stream.get_bits(2);
			for (ch = 0; ch < channels; ch++) {
				si.ch[ch].gr[0].part2_3_length = stream.get_bits(12);
				si.ch[ch].gr[0].big_values = stream.get_bits(9);
				si.ch[ch].gr[0].global_gain = stream.get_bits(8);
				si.ch[ch].gr[0].scalefac_compress = stream.get_bits(9);
				si.ch[ch].gr[0].window_switching_flag = stream.get_bits(1);
				if ((si.ch[ch].gr[0].window_switching_flag) != 0) {
					si.ch[ch].gr[0].block_type = stream.get_bits(2);
					si.ch[ch].gr[0].mixed_block_flag = stream.get_bits(1);
					si.ch[ch].gr[0].table_select[0] = stream.get_bits(5);
					si.ch[ch].gr[0].table_select[1] = stream.get_bits(5);
					si.ch[ch].gr[0].subblock_gain[0] = stream.get_bits(3);
					si.ch[ch].gr[0].subblock_gain[1] = stream.get_bits(3);
					si.ch[ch].gr[0].subblock_gain[2] = stream.get_bits(3);
					if (si.ch[ch].gr[0].block_type == 0) {
						return false;
					} else if (si.ch[ch].gr[0].block_type == 2 && si.ch[ch].gr[0].mixed_block_flag == 0) {
						si.ch[ch].gr[0].region0_count = 8;
					} else {
						si.ch[ch].gr[0].region0_count = 7;
						si.ch[ch].gr[0].region1_count = 20 - si.ch[ch].gr[0].region0_count;
					}
				} else {
					si.ch[ch].gr[0].table_select[0] = stream.get_bits(5);
					si.ch[ch].gr[0].table_select[1] = stream.get_bits(5);
					si.ch[ch].gr[0].table_select[2] = stream.get_bits(5);
					si.ch[ch].gr[0].region0_count = stream.get_bits(4);
					si.ch[ch].gr[0].region1_count = stream.get_bits(3);
					si.ch[ch].gr[0].block_type = 0;
				}
				si.ch[ch].gr[0].scalefac_scale = stream.get_bits(1);
				si.ch[ch].gr[0].count1table_select = stream.get_bits(1);
			}
		}
		return true;
	}
	MP3Layer3.prototype.get_scale_factors = function(ch, gr) {
		var scalefac = this.scalefac;
		var br = this.br;
		var si = this.si;
		var sfb = 0, _window = 0;
		var gr_info = (si.ch[ch].gr[gr]);
		var scale_comp = gr_info.scalefac_compress;
		var length0 = MP3Layer3.slen[0][scale_comp];
		var length1 = MP3Layer3.slen[1][scale_comp];
		if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2)) {
			if ((gr_info.mixed_block_flag) != 0) {
				for (sfb = 0; sfb < 8; sfb++)
					this.scalefac[ch].l[sfb] = br.hgetbits(MP3Layer3.slen[0][gr_info.scalefac_compress]);
				for (sfb = 3; sfb < 6; sfb++)
					for (_window = 0; _window < 3; _window++)
						this.scalefac[ch].s[_window][sfb] = br.hgetbits(MP3Layer3.slen[0][gr_info.scalefac_compress]);
				for (sfb = 6; sfb < 12; sfb++)
					for (_window = 0; _window < 3; _window++)
						this.scalefac[ch].s[_window][sfb] = br.hgetbits(MP3Layer3.slen[1][gr_info.scalefac_compress]);
				for (sfb = 12, _window = 0; _window < 3; _window++)
					this.scalefac[ch].s[_window][sfb] = 0;
			} else {
				scalefac[ch].s[0][0] = br.hgetbits(length0);
				scalefac[ch].s[1][0] = br.hgetbits(length0);
				scalefac[ch].s[2][0] = br.hgetbits(length0);
				scalefac[ch].s[0][1] = br.hgetbits(length0);
				scalefac[ch].s[1][1] = br.hgetbits(length0);
				scalefac[ch].s[2][1] = br.hgetbits(length0);
				scalefac[ch].s[0][2] = br.hgetbits(length0);
				scalefac[ch].s[1][2] = br.hgetbits(length0);
				scalefac[ch].s[2][2] = br.hgetbits(length0);
				scalefac[ch].s[0][3] = br.hgetbits(length0);
				scalefac[ch].s[1][3] = br.hgetbits(length0);
				scalefac[ch].s[2][3] = br.hgetbits(length0);
				scalefac[ch].s[0][4] = br.hgetbits(length0);
				scalefac[ch].s[1][4] = br.hgetbits(length0);
				scalefac[ch].s[2][4] = br.hgetbits(length0);
				scalefac[ch].s[0][5] = br.hgetbits(length0);
				scalefac[ch].s[1][5] = br.hgetbits(length0);
				scalefac[ch].s[2][5] = br.hgetbits(length0);
				scalefac[ch].s[0][6] = br.hgetbits(length1);
				scalefac[ch].s[1][6] = br.hgetbits(length1);
				scalefac[ch].s[2][6] = br.hgetbits(length1);
				scalefac[ch].s[0][7] = br.hgetbits(length1);
				scalefac[ch].s[1][7] = br.hgetbits(length1);
				scalefac[ch].s[2][7] = br.hgetbits(length1);
				scalefac[ch].s[0][8] = br.hgetbits(length1);
				scalefac[ch].s[1][8] = br.hgetbits(length1);
				scalefac[ch].s[2][8] = br.hgetbits(length1);
				scalefac[ch].s[0][9] = br.hgetbits(length1);
				scalefac[ch].s[1][9] = br.hgetbits(length1);
				scalefac[ch].s[2][9] = br.hgetbits(length1);
				scalefac[ch].s[0][10] = br.hgetbits(length1);
				scalefac[ch].s[1][10] = br.hgetbits(length1);
				scalefac[ch].s[2][10] = br.hgetbits(length1);
				scalefac[ch].s[0][11] = br.hgetbits(length1);
				scalefac[ch].s[1][11] = br.hgetbits(length1);
				scalefac[ch].s[2][11] = br.hgetbits(length1);
				scalefac[ch].s[0][12] = 0;
				scalefac[ch].s[1][12] = 0;
				scalefac[ch].s[2][12] = 0;
			}
		} else {
			if ((si.ch[ch].scfsi[0] == 0) || (gr == 0)) {
				scalefac[ch].l[0] = br.hgetbits(length0);
				scalefac[ch].l[1] = br.hgetbits(length0);
				scalefac[ch].l[2] = br.hgetbits(length0);
				scalefac[ch].l[3] = br.hgetbits(length0);
				scalefac[ch].l[4] = br.hgetbits(length0);
				scalefac[ch].l[5] = br.hgetbits(length0);
			}
			if ((si.ch[ch].scfsi[1] == 0) || (gr == 0)) {
				scalefac[ch].l[6] = br.hgetbits(length0);
				scalefac[ch].l[7] = br.hgetbits(length0);
				scalefac[ch].l[8] = br.hgetbits(length0);
				scalefac[ch].l[9] = br.hgetbits(length0);
				scalefac[ch].l[10] = br.hgetbits(length0);
			}
			if ((si.ch[ch].scfsi[2] == 0) || (gr == 0)) {
				scalefac[ch].l[11] = br.hgetbits(length1);
				scalefac[ch].l[12] = br.hgetbits(length1);
				scalefac[ch].l[13] = br.hgetbits(length1);
				scalefac[ch].l[14] = br.hgetbits(length1);
				scalefac[ch].l[15] = br.hgetbits(length1);
			}
			if ((si.ch[ch].scfsi[3] == 0) || (gr == 0)) {
				scalefac[ch].l[16] = br.hgetbits(length1);
				scalefac[ch].l[17] = br.hgetbits(length1);
				scalefac[ch].l[18] = br.hgetbits(length1);
				scalefac[ch].l[19] = br.hgetbits(length1);
				scalefac[ch].l[20] = br.hgetbits(length1);
			}
			scalefac[ch].l[21] = 0;
			scalefac[ch].l[22] = 0;
		}
	}
	MP3Layer3.prototype.get_LSF_scale_data = function(ch, gr) {
		var new_slen = this.new_slen;
		var si = this.si;
		var br = this.br;
		var scalefac_comp = 0, int_scalefac_comp = 0;
		var mode_ext = this.header.mode_extension();
		var m;
		var blocktypenumber = 0;
		var blocknumber = 0;
		var gr_info = (si.ch[ch].gr[gr]);
		scalefac_comp = gr_info.scalefac_compress;
		if (gr_info.block_type == 2) {
			if (gr_info.mixed_block_flag == 0)
				blocktypenumber = 1;
			else if (gr_info.mixed_block_flag == 1)
				blocktypenumber = 2;
			else
				blocktypenumber = 0;
		} else {
			blocktypenumber = 0;
		}
		if (!(((mode_ext == 1) || (mode_ext == 3)) && (ch == 1))) {
			if (scalefac_comp < 400) {
				new_slen[0] = (scalefac_comp >>> 4) / 5;
				new_slen[1] = (scalefac_comp >>> 4) % 5;
				new_slen[2] = (scalefac_comp & 0xF) >>> 2;
				new_slen[3] = (scalefac_comp & 3);
				si.ch[ch].gr[gr].preflag = 0;
				blocknumber = 0;
			} else if (scalefac_comp < 500) {
				new_slen[0] = ((scalefac_comp - 400) >>> 2) / 5;
				new_slen[1] = ((scalefac_comp - 400) >>> 2) % 5;
				new_slen[2] = (scalefac_comp - 400) & 3;
				new_slen[3] = 0;
				si.ch[ch].gr[gr].preflag = 0;
				blocknumber = 1;
			} else if (scalefac_comp < 512) {
				new_slen[0] = (scalefac_comp - 500) / 3;
				new_slen[1] = (scalefac_comp - 500) % 3;
				new_slen[2] = 0;
				new_slen[3] = 0;
				si.ch[ch].gr[gr].preflag = 1;
				blocknumber = 2;
			}
		}
		if ((((mode_ext == 1) || (mode_ext == 3)) && (ch == 1))) {
			int_scalefac_comp = scalefac_comp >>> 1;
			if (int_scalefac_comp < 180) {
				new_slen[0] = int_scalefac_comp / 36;
				new_slen[1] = (int_scalefac_comp % 36) / 6;
				new_slen[2] = (int_scalefac_comp % 36) % 6;
				new_slen[3] = 0;
				si.ch[ch].gr[gr].preflag = 0;
				blocknumber = 3;
			} else if (int_scalefac_comp < 244) {
				new_slen[0] = ((int_scalefac_comp - 180) & 0x3F) >>> 4;
				new_slen[1] = ((int_scalefac_comp - 180) & 0xF) >>> 2;
				new_slen[2] = (int_scalefac_comp - 180) & 3;
				new_slen[3] = 0;
				si.ch[ch].gr[gr].preflag = 0;
				blocknumber = 4;
			} else if (int_scalefac_comp < 255) {
				new_slen[0] = (int_scalefac_comp - 244) / 3;
				new_slen[1] = (int_scalefac_comp - 244) % 3;
				new_slen[2] = 0;
				new_slen[3] = 0;
				si.ch[ch].gr[gr].preflag = 0;
				blocknumber = 5;
			}
		}
		for (var x = 0; x < 45; x++)
			this.scalefac_buffer[x] = 0;
		m = 0;
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < MP3Layer3.nr_of_sfb_block[blocknumber][blocktypenumber][i]; j++) {
				this.scalefac_buffer[m] = (new_slen[i] == 0) ? 0 : br.hgetbits(new_slen[i]);
				m++;
			}
		}
	}
	MP3Layer3.prototype.get_LSF_scale_factors = function(ch, gr) {
		var si = this.si;
		var scalefac = this.scalefac;
		var m = 0;
		var sfb = 0, _window = 0;
		var gr_info = (si.ch[ch].gr[gr]);
		this.get_LSF_scale_data(ch, gr);
		if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2)) {
			if (gr_info.mixed_block_flag != 0) { // MIXED
				for (sfb = 0; sfb < 8; sfb++) {
					scalefac[ch].l[sfb] = this.scalefac_buffer[m];
					m++;
				}
				for (sfb = 3; sfb < 12; sfb++) {
					for (_window = 0; _window < 3; _window++) {
						scalefac[ch].s[_window][sfb] = this.scalefac_buffer[m];
						m++;
					}
				}
				for (_window = 0; _window < 3; _window++)
					scalefac[ch].s[_window][12] = 0;

			} else { // SHORT
				for (sfb = 0; sfb < 12; sfb++) {
					for (_window = 0; _window < 3; _window++) {
						scalefac[ch].s[_window][sfb] = this.scalefac_buffer[m];
						m++;
					}
				}
				for (_window = 0; _window < 3; _window++)
					scalefac[ch].s[_window][12] = 0;
			}
		} else { // LONG types 0,1,3
			for (sfb = 0; sfb < 21; sfb++) {
				scalefac[ch].l[sfb] = this.scalefac_buffer[m];
				m++;
			}
			scalefac[ch].l[21] = 0; // Jeff
			scalefac[ch].l[22] = 0;
		}
	}
	var x = new Int32Array(1);
	var y = new Int32Array(1);
	var v = new Int32Array(1);
	var w = new Int32Array(1);
	MP3Layer3.prototype.huffman_decode = function(ch, gr) {
		var br = this.br;
		var si = this.si;
		var is_1d = this.is_1d;
		var sfreq = this.sfreq;
		x[0] = 0;
		y[0] = 0;
		v[0] = 0;
		w[0] = 0;
		var part2_3_end = this.part2_start + si.ch[ch].gr[gr].part2_3_length;
		var num_bits = 0;
		var region1Start = 0;
		var region2Start = 0;
		var index = 0;
		var buf = 0, buf1 = 0;
		var h = null;
		if (((si.ch[ch].gr[gr].window_switching_flag) != 0) && (si.ch[ch].gr[gr].block_type == 2)) {
			region1Start = (sfreq == 8) ? 72 : 36;
			region2Start = 576;
		} else {
			buf = si.ch[ch].gr[gr].region0_count + 1;
			buf1 = buf + si.ch[ch].gr[gr].region1_count + 1;
			if (buf1 > MP3Layer3.sfBandIndex[sfreq].l.length - 1) {
				buf1 = MP3Layer3.sfBandIndex[sfreq].l.length - 1;
			}
			region1Start = MP3Layer3.sfBandIndex[sfreq].l[buf];
			region2Start = MP3Layer3.sfBandIndex[sfreq].l[buf1];
		}
		index = 0;
		for (var i = 0; i < (si.ch[ch].gr[gr].big_values << 1); i += 2) {
			if (i < region1Start) h = huffcodetab.ht[si.ch[ch].gr[gr].table_select[0]];
			else if (i < region2Start) h = huffcodetab.ht[si.ch[ch].gr[gr].table_select[1]];
			else h = huffcodetab.ht[si.ch[ch].gr[gr].table_select[2]];
			huffcodetab.huffman_decoder(h, x, y, v, w, br);
			is_1d[index++] = x[0];
			is_1d[index++] = y[0];
			this.checkSumHuff = this.checkSumHuff + x[0] + y[0];
		}
		h = huffcodetab.ht[si.ch[ch].gr[gr].count1table_select + 32];
		num_bits = br.hsstell();
		while ((num_bits < part2_3_end) && (index < 576)) {
			huffcodetab.huffman_decoder(h, x, y, v, w, br);
			is_1d[index++] = v[0];
			is_1d[index++] = w[0];
			is_1d[index++] = x[0];
			is_1d[index++] = y[0];
			this.checkSumHuff = this.checkSumHuff + v[0] + w[0] + x[0] + y[0];
			num_bits = br.hsstell();
		}
		if (num_bits > part2_3_end) {
			br.rewindNbits(num_bits - part2_3_end);
			index -= 4;
		}
		num_bits = br.hsstell();
		if (num_bits < part2_3_end)
			br.hgetbits(part2_3_end - num_bits);
		this.nonzero[ch] = Math.min(index, 576);
		if (index < 0) index = 0;
		for (; index < 576; index++)
			is_1d[index] = 0;
	}
	MP3Layer3.prototype.dequantize_sample = function(xr, ch, gr) {
		var scalefac = this.scalefac;
		var sfreq = this.sfreq;
		var is_1d = this.is_1d;
		var si = this.si;
		var gr_info = (si.ch[ch].gr[gr]);
		var cb = 0;
		var next_cb_boundary = 0;
		var cb_begin = 0;
		var cb_width = 0;
		var index = 0, t_index = 0, j = 0;
		var g_gain = 0;
		var xr_1d = xr;
		if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2)) {
			if (gr_info.mixed_block_flag != 0)
				next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].l[1];
			else {
				cb_width = MP3Layer3.sfBandIndex[sfreq].s[1];
				next_cb_boundary = (cb_width << 2) - cb_width;
				cb_begin = 0;
			}
		} else {
			next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].l[1];
		}
		g_gain = Math.pow(2.0, (0.25 * (gr_info.global_gain - 210.0)));
		for (j = 0; j < this.nonzero[ch]; j++) {
			var reste = j % MP3Layer3.SSLIMIT;
			var quotien = ((j - reste) / MP3Layer3.SSLIMIT) | 0;
			if (is_1d[j] == 0) xr_1d[quotien][reste] = 0.0;
			else {
				var abv = is_1d[j];
				if (abv < MP3Layer3.t_43.length) {
					if (is_1d[j] > 0) xr_1d[quotien][reste] = g_gain * MP3Layer3.t_43[abv];
					else {
						if (-abv < MP3Layer3.t_43.length) xr_1d[quotien][reste] = -g_gain * MP3Layer3.t_43[-abv];
						else xr_1d[quotien][reste] = -g_gain * Math.pow(-abv, MP3Layer3.d43);
					}
				} else {
					if (is_1d[j] > 0) xr_1d[quotien][reste] = g_gain * Math.pow(abv, MP3Layer3.d43);
					else xr_1d[quotien][reste] = -g_gain * Math.pow(-abv, MP3Layer3.d43);
				}
			}
		}
		for (j = 0; j < this.nonzero[ch]; j++) {
			var reste = j % MP3Layer3.SSLIMIT;
			var quotien = ((j - reste) / MP3Layer3.SSLIMIT) | 0;
			if (index == next_cb_boundary) {
				if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2)) {
					if (gr_info.mixed_block_flag != 0) {
						if (index == MP3Layer3.sfBandIndex[sfreq].l[8]) {
							next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].s[4];
							next_cb_boundary = (next_cb_boundary << 2) - next_cb_boundary;
							cb = 3;
							cb_width = MP3Layer3.sfBandIndex[sfreq].s[4] - MP3Layer3.sfBandIndex[sfreq].s[3];
							cb_begin = MP3Layer3.sfBandIndex[sfreq].s[3];
							cb_begin = (cb_begin << 2) - cb_begin;
						} else if (index < MP3Layer3.sfBandIndex[sfreq].l[8]) {
							next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].l[(++cb) + 1];
						} else {
							next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].s[(++cb) + 1];
							next_cb_boundary = (next_cb_boundary << 2) - next_cb_boundary;
							cb_begin = MP3Layer3.sfBandIndex[sfreq].s[cb];
							cb_width = MP3Layer3.sfBandIndex[sfreq].s[cb + 1] - cb_begin;
							cb_begin = (cb_begin << 2) - cb_begin;
						}
					} else {
						next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].s[(++cb) + 1];
						next_cb_boundary = (next_cb_boundary << 2) - next_cb_boundary;
						cb_begin = MP3Layer3.sfBandIndex[sfreq].s[cb];
						cb_width = MP3Layer3.sfBandIndex[sfreq].s[cb + 1] - cb_begin;
						cb_begin = (cb_begin << 2) - cb_begin;
					}
				} else {
					next_cb_boundary = MP3Layer3.sfBandIndex[sfreq].l[(++cb) + 1];
				}
			}
			if ((gr_info.window_switching_flag != 0) && (((gr_info.block_type == 2) && (gr_info.mixed_block_flag == 0)) || ((gr_info.block_type == 2) && (gr_info.mixed_block_flag != 0) && (j >= 36)))) {
				t_index = ((index - cb_begin) / cb_width) | 0;
				var idx = scalefac[ch].s[t_index][cb] << gr_info.scalefac_scale;
				idx += (gr_info.subblock_gain[t_index] << 2);
				xr_1d[quotien][reste] *= MP3Layer3.two_to_negative_half_pow[idx];
			} else {
				var idx = scalefac[ch].l[cb];
				if (gr_info.preflag != 0) idx += MP3Layer3.pretab[cb];
				idx = idx << gr_info.scalefac_scale;
				xr_1d[quotien][reste] *= MP3Layer3.two_to_negative_half_pow[idx];
			}
			index++;
		}
		for (j = this.nonzero[ch]; j < 576; j++) {
			var reste = j % MP3Layer3.SSLIMIT;
			var quotien = ((j - reste) / MP3Layer3.SSLIMIT) | 0;
			if (reste < 0) reste = 0;
			if (quotien < 0) quotien = 0;
			xr_1d[quotien][reste] = 0.0;
		}
	}
	MP3Layer3.nr_of_sfb_block = [
		[[6, 5, 5, 5], [9, 9, 9, 9], [6, 9, 9, 9]],
		[[6, 5, 7, 3], [9, 9, 12, 6], [6, 9, 12, 6]],
		[[11, 10, 0, 0], [18, 18, 0, 0], [15, 18, 0, 0]],
		[[7, 7, 7, 0], [12, 12, 12, 0], [6, 15, 12, 0]],
		[[6, 6, 6, 3], [12, 9, 9, 6], [6, 12, 9, 6]],
		[[8, 8, 5, 0], [15, 12, 9, 0], [6, 18, 9, 0]]
	];
	var is_pos = new Int32Array(576);
	var is_ratio = new Float32Array(576);
	MP3Layer3.io = [[1.0000000000E+00, 8.4089641526E-01, 7.0710678119E-01, 5.9460355751E-01, 5.0000000001E-01, 4.2044820763E-01, 3.5355339060E-01, 2.9730177876E-01, 2.5000000001E-01, 2.1022410382E-01, 1.7677669530E-01, 1.4865088938E-01, 1.2500000000E-01, 1.0511205191E-01, 8.8388347652E-02, 7.4325444691E-02, 6.2500000003E-02, 5.2556025956E-02, 4.4194173826E-02, 3.7162722346E-02, 3.1250000002E-02, 2.6278012978E-02, 2.2097086913E-02, 1.8581361173E-02, 1.5625000001E-02, 1.3139006489E-02, 1.1048543457E-02, 9.2906805866E-03, 7.8125000006E-03, 6.5695032447E-03, 5.5242717285E-03, 4.6453402934E-03], [1.0000000000E+00, 7.0710678119E-01, 5.0000000000E-01, 3.5355339060E-01, 2.5000000000E-01, 1.7677669530E-01, 1.2500000000E-01, 8.8388347650E-02, 6.2500000001E-02, 4.4194173825E-02, 3.1250000001E-02, 2.2097086913E-02, 1.5625000000E-02, 1.1048543456E-02, 7.8125000002E-03, 5.5242717282E-03, 3.9062500001E-03, 2.7621358641E-03, 1.9531250001E-03, 1.3810679321E-03, 9.7656250004E-04, 6.9053396603E-04, 4.8828125002E-04, 3.4526698302E-04, 2.4414062501E-04, 1.7263349151E-04, 1.2207031251E-04, 8.6316745755E-05, 6.1035156254E-05, 4.3158372878E-05, 3.0517578127E-05, 2.1579186439E-05]]
	MP3Layer3.TAN12 = new Float32Array([0.0, 0.26794919, 0.57735027, 1.0, 1.73205081, 3.73205081, 9.9999999e10, -3.73205081, -1.73205081, -1.0, -0.57735027, -0.26794919, 0.0, 0.26794919, 0.57735027, 1.0]);
	MP3Layer3.cs = new Float32Array([0.857492925712, 0.881741997318, 0.949628649103, 0.983314592492, 0.995517816065, 0.999160558175, 0.999899195243, 0.999993155067]);
	MP3Layer3.ca = new Float32Array([-0.5144957554270, -0.4717319685650, -0.3133774542040, -0.1819131996110, -0.0945741925262, -0.0409655828852, -0.0141985685725, -0.00369997467375]);
	MP3Layer3.two_to_negative_half_pow = new Float32Array([1.0000000000E+00, 7.0710678119E-01, 5.0000000000E-01, 3.5355339059E-01, 2.5000000000E-01, 1.7677669530E-01, 1.2500000000E-01, 8.8388347648E-02, 6.2500000000E-02, 4.4194173824E-02, 3.1250000000E-02, 2.2097086912E-02, 1.5625000000E-02, 1.1048543456E-02, 7.8125000000E-03, 5.5242717280E-03, 3.9062500000E-03, 2.7621358640E-03, 1.9531250000E-03, 1.3810679320E-03, 9.7656250000E-04, 6.9053396600E-04, 4.8828125000E-04, 3.4526698300E-04, 2.4414062500E-04, 1.7263349150E-04, 1.2207031250E-04, 8.6316745750E-05, 6.1035156250E-05, 4.3158372875E-05, 3.0517578125E-05, 2.1579186438E-05, 1.5258789062E-05, 1.0789593219E-05, 7.6293945312E-06, 5.3947966094E-06, 3.8146972656E-06, 2.6973983047E-06, 1.9073486328E-06, 1.3486991523E-06, 9.5367431641E-07, 6.7434957617E-07, 4.7683715820E-07, 3.3717478809E-07, 2.3841857910E-07, 1.6858739404E-07, 1.1920928955E-07, 8.4293697022E-08, 5.9604644775E-08, 4.2146848511E-08, 2.9802322388E-08, 2.1073424255E-08, 1.4901161194E-08, 1.0536712128E-08, 7.4505805969E-09, 5.2683560639E-09, 3.7252902985E-09, 2.6341780319E-09, 1.8626451492E-09, 1.3170890160E-09, 9.3132257462E-10, 6.5854450798E-10, 4.6566128731E-10, 3.2927225399E-10]);
	MP3Layer3.prototype.i_stereo_k_values = function(is_pos, io_type, i) {
		var k = this.k;
		if (is_pos == 0) {
			k[0][i] = 1.0;
			k[1][i] = 1.0;
		} else if ((is_pos & 1) != 0) {
			k[0][i] = MP3Layer3.io[io_type][(is_pos + 1) >>> 1];
			k[1][i] = 1.0;
		} else {
			k[0][i] = 1.0;
			k[1][i] = MP3Layer3.io[io_type][is_pos >>> 1];
		}
	}
	MP3Layer3.prototype.stereo = function(gr) {
		var sfreq = this.sfreq;
		var scalefac = this.scalefac;
		var ro = this.ro;
		var lr = this.lr;
		var si = this.si;
		var k = this.k;
		var sb = 0, ss = 0;
		if (this.channels == 1) {
			for (sb = 0; sb < MP3Layer3.SBLIMIT; sb++)
				for (ss = 0; ss < MP3Layer3.SSLIMIT; ss += 3) {
					lr[0][sb][ss] = ro[0][sb][ss];
					lr[0][sb][ss + 1] = ro[0][sb][ss + 1];
					lr[0][sb][ss + 2] = ro[0][sb][ss + 2];
				}
		} else {
			var gr_info = (si.ch[0].gr[gr]);
			var mode_ext = this.header.mode_extension();
			var sfb = 0;
			var i = 0;
			var lines = 0, temp = 0, temp2 = 0;
			var ms_stereo = ((this.header.mode() == MP3Header.JOINT_STEREO) && ((mode_ext & 0x2) != 0));
			var i_stereo = ((this.header.mode() == MP3Header.JOINT_STEREO) && ((mode_ext & 0x1) != 0));
			var lsf = ((this.header.version() == MP3Header.MPEG2_LSF || this.header.version() == MP3Header.MPEG25_LSF));
			var io_type = (gr_info.scalefac_compress & 1);
			for (i = 0; i < 576; i++) {
				is_pos[i] = 7;
				is_ratio[i] = 0.0;
			}
			if (i_stereo) {
				if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2)) {
					if (gr_info.mixed_block_flag != 0) {
						var max_sfb = 0;
						for (var j = 0; j < 3; j++) {
							var sfbcnt = 0;
							sfbcnt = 2;
							for (sfb = 12; sfb >= 3; sfb--) {
								i = MP3Layer3.sfBandIndex[sfreq].s[sfb];
								lines = MP3Layer3.sfBandIndex[sfreq].s[sfb + 1] - i;
								i = (i << 2) - i + (j + 1) * lines - 1;
								while (lines > 0) {
									if (ro[1][(i / 18) | 0][i % 18] != 0.0) {
										sfbcnt = sfb;
										sfb = -10;
										lines = -10;
									}
									lines--;
									i--;
								}
							}
							sfb = sfbcnt + 1;
							if (sfb > max_sfb)
								max_sfb = sfb;
							while (sfb < 12) {
								temp = MP3Layer3.sfBandIndex[sfreq].s[sfb];
								sb = MP3Layer3.sfBandIndex[sfreq].s[sfb + 1] - temp;
								i = (temp << 2) - temp + j * sb;
								for (; sb > 0; sb--) {
									is_pos[i] = scalefac[1].s[j][sfb];
									if (is_pos[i] != 7)
										if (lsf)
											this.i_stereo_k_values(is_pos[i], io_type, i);
										else
											is_ratio[i] = MP3Layer3.TAN12[is_pos[i]];
									i++;
								}
								sfb++;
							}
							sfb = MP3Layer3.sfBandIndex[sfreq].s[10];
							sb = MP3Layer3.sfBandIndex[sfreq].s[11] - sfb;
							sfb = (sfb << 2) - sfb + j * sb;
							temp = MP3Layer3.sfBandIndex[sfreq].s[11];
							sb = MP3Layer3.sfBandIndex[sfreq].s[12] - temp;
							i = (temp << 2) - temp + j * sb;
							for (; sb > 0; sb--) {
								is_pos[i] = is_pos[sfb];
								if (lsf) {
									k[0][i] = k[0][sfb];
									k[1][i] = k[1][sfb];
								} else {
									is_ratio[i] = is_ratio[sfb];
								}
								i++;
							}
						}
						if (max_sfb <= 3) {
							i = 2;
							ss = 17;
							sb = -1;
							while (i >= 0) {
								if (ro[1][i][ss] != 0.0) {
									sb = (i << 4) + (i << 1) + ss;
									i = -1;
								} else {
									ss--;
									if (ss < 0) {
										i--;
										ss = 17;
									}
								}
							}
							i = 0;
							while (MP3Layer3.sfBandIndex[sfreq].l[i] <= sb)
								i++;
							sfb = i;
							i = MP3Layer3.sfBandIndex[sfreq].l[i];
							for (; sfb < 8; sfb++) {
								sb = MP3Layer3.sfBandIndex[sfreq].l[sfb + 1] - MP3Layer3.sfBandIndex[sfreq].l[sfb];
								for (; sb > 0; sb--) {
									is_pos[i] = scalefac[1].l[sfb];
									if (is_pos[i] != 7)
										if (lsf)
											this.i_stereo_k_values(is_pos[i], io_type, i);
										else
											is_ratio[i] = MP3Layer3.TAN12[is_pos[i]];
									i++;
								}
							}
						}
					} else {
						for (var j = 0; j < 3; j++) {
							var sfbcnt = 0;
							sfbcnt = -1;
							for (sfb = 12; sfb >= 0; sfb--) {
								temp = MP3Layer3.sfBandIndex[sfreq].s[sfb];
								lines = MP3Layer3.sfBandIndex[sfreq].s[sfb + 1] - temp;
								i = (temp << 2) - temp + (j + 1) * lines - 1;
								while (lines > 0) {
									if (ro[1][(i / 18) | 0][i % 18] != 0.0) {
										sfbcnt = sfb;
										sfb = -10;
										lines = -10;
									}
									lines--;
									i--;
								}
							}
							sfb = sfbcnt + 1;
							while (sfb < 12) {
								temp = MP3Layer3.sfBandIndex[sfreq].s[sfb];
								sb = MP3Layer3.sfBandIndex[sfreq].s[sfb + 1] - temp;
								i = (temp << 2) - temp + j * sb;
								for (; sb > 0; sb--) {
									is_pos[i] = scalefac[1].s[j][sfb];
									if (is_pos[i] != 7)
										if (lsf)
											this.i_stereo_k_values(is_pos[i], io_type, i);
										else
											is_ratio[i] = MP3Layer3.TAN12[is_pos[i]];
									i++;
								}
								sfb++;
							}
							temp = MP3Layer3.sfBandIndex[sfreq].s[10];
							temp2 = MP3Layer3.sfBandIndex[sfreq].s[11];
							sb = temp2 - temp;
							sfb = (temp << 2) - temp + j * sb;
							sb = MP3Layer3.sfBandIndex[sfreq].s[12] - temp2;
							i = (temp2 << 2) - temp2 + j * sb;
							for (; sb > 0; sb--) {
								is_pos[i] = is_pos[sfb];
								if (lsf) {
									k[0][i] = k[0][sfb];
									k[1][i] = k[1][sfb];
								} else {
									is_ratio[i] = is_ratio[sfb];
								}
								i++;
							}
						}
					}
				} else {
					i = 31;
					ss = 17;
					sb = 0;
					while (i >= 0) {
						if (ro[1][i][ss] != 0.0) {
							sb = (i << 4) + (i << 1) + ss;
							i = -1;
						} else {
							ss--;
							if (ss < 0) {
								i--;
								ss = 17;
							}
						}
					}
					i = 0;
					while (MP3Layer3.sfBandIndex[sfreq].l[i] <= sb)
						i++;
					sfb = i;
					i = MP3Layer3.sfBandIndex[sfreq].l[i];
					for (; sfb < 21; sfb++) {
						sb = MP3Layer3.sfBandIndex[sfreq].l[sfb + 1] - MP3Layer3.sfBandIndex[sfreq].l[sfb];
						for (; sb > 0; sb--) {
							is_pos[i] = scalefac[1].l[sfb];
							if (is_pos[i] != 7)
								if (lsf)
									this.i_stereo_k_values(is_pos[i], io_type, i);
								else
									is_ratio[i] = MP3Layer3.TAN12[is_pos[i]];
							i++;
						}
					}
					sfb = MP3Layer3.sfBandIndex[sfreq].l[20];
					for (sb = 576 - MP3Layer3.sfBandIndex[sfreq].l[21]; (sb > 0) && (i < 576); sb--) {
						is_pos[i] = is_pos[sfb];
						if (lsf) {
							k[0][i] = k[0][sfb];
							k[1][i] = k[1][sfb];
						} else {
							is_ratio[i] = is_ratio[sfb];
						}
						i++;
					}
				}
			}
			i = 0;
			for (sb = 0; sb < MP3Layer3.SBLIMIT; sb++)
				for (ss = 0; ss < MP3Layer3.SSLIMIT; ss++) {
					if (is_pos[i] == 7) {
						if (ms_stereo) {
							lr[0][sb][ss] = (ro[0][sb][ss] + ro[1][sb][ss]) * 0.707106781;
							lr[1][sb][ss] = (ro[0][sb][ss] - ro[1][sb][ss]) * 0.707106781;
						} else {
							lr[0][sb][ss] = ro[0][sb][ss];
							lr[1][sb][ss] = ro[1][sb][ss];
						}
					} else if (i_stereo) {
						if (lsf) {
							lr[0][sb][ss] = ro[0][sb][ss] * k[0][i];
							lr[1][sb][ss] = ro[0][sb][ss] * k[1][i];
						} else {
							lr[1][sb][ss] = ro[0][sb][ss] / (1 + is_ratio[i]);
							lr[0][sb][ss] = lr[1][sb][ss] * is_ratio[i];
						}
					}
					i++;
				}
		}
	}
	MP3Layer3.prototype.do_downmix = function() {
		var lr = this.lr;
		for (var sb = 0; sb < MP3Layer3.SSLIMIT; sb++) {
			for (var ss = 0; ss < MP3Layer3.SSLIMIT; ss += 3) {
				lr[0][sb][ss] = (lr[0][sb][ss] + lr[1][sb][ss]) * 0.5;
				lr[0][sb][ss + 1] = (lr[0][sb][ss + 1] + lr[1][sb][ss + 1]) * 0.5;
				lr[0][sb][ss + 2] = (lr[0][sb][ss + 2] + lr[1][sb][ss + 2]) * 0.5;
			}
		}
	}
	MP3Layer3.prototype.reorder = function(xr, ch, gr) {
		var sfreq = this.sfreq;
		var si = this.si;
		var out_1d = this.out_1d;
		var gr_info = (si.ch[ch].gr[gr]);
		var freq = 0, freq3 = 0;
		var index = 0;
		var sfb = 0, sfb_start = 0, sfb_lines = 0;
		var src_line = 0, des_line = 0;
		var xr_1d = xr;
		if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2)) {
			for (index = 0; index < 576; index++)
				out_1d[index] = 0.0;
			if (gr_info.mixed_block_flag != 0) {
				for (index = 0; index < 36; index++) {
					var reste = index % MP3Layer3.SSLIMIT;
					var quotien = ((index - reste) / MP3Layer3.SSLIMIT) | 0;
					out_1d[index] = xr_1d[quotien][reste];
				}
				for (sfb = 3; sfb < 13; sfb++) {
					sfb_start = MP3Layer3.sfBandIndex[sfreq].s[sfb];
					sfb_lines = MP3Layer3.sfBandIndex[sfreq].s[sfb + 1] - sfb_start;
					var sfb_start3 = (sfb_start << 2) - sfb_start;
					for (freq = 0, freq3 = 0; freq < sfb_lines; freq++, freq3 += 3) {
						src_line = sfb_start3 + freq;
						des_line = sfb_start3 + freq3;
						var reste = src_line % MP3Layer3.SSLIMIT;
						var quotien = ((src_line - reste) / MP3Layer3.SSLIMIT) | 0;
						out_1d[des_line] = xr_1d[quotien][reste];
						src_line += sfb_lines;
						des_line++;
						reste = src_line % MP3Layer3.SSLIMIT;
						quotien = ((src_line - reste) / MP3Layer3.SSLIMIT) | 0;
						out_1d[des_line] = xr_1d[quotien][reste];
						src_line += sfb_lines;
						des_line++;
						reste = src_line % MP3Layer3.SSLIMIT;
						quotien = ((src_line - reste) / MP3Layer3.SSLIMIT) | 0;
						out_1d[des_line] = xr_1d[quotien][reste];
					}
				}
			} else {
				for (index = 0; index < 576; index++) {
					var j = MP3Layer3.reorder_table[sfreq][index];
					var reste = j % MP3Layer3.SSLIMIT;
					var quotien = ((j - reste) / MP3Layer3.SSLIMIT) | 0;
					out_1d[index] = xr_1d[quotien][reste];
				}
			}
		} else {
			for (index = 0; index < 576; index++) {
				var reste = index % MP3Layer3.SSLIMIT;
				var quotien = ((index - reste) / MP3Layer3.SSLIMIT) | 0;
				out_1d[index] = xr_1d[quotien][reste];
			}
		}
	}
	MP3Layer3.prototype.antialias = function(ch, gr) {
		var si = this.si;
		var out_1d = this.out_1d;
		var sb18 = 0, ss = 0, sb18lim = 0;
		var gr_info = (si.ch[ch].gr[gr]);
		if ((gr_info.window_switching_flag != 0) && (gr_info.block_type == 2) && !(gr_info.mixed_block_flag != 0))
			return;
		if ((gr_info.window_switching_flag != 0) && (gr_info.mixed_block_flag != 0) && (gr_info.block_type == 2)) {
			sb18lim = 18;
		} else {
			sb18lim = 558;
		}
		for (sb18 = 0; sb18 < sb18lim; sb18 += 18) {
			for (ss = 0; ss < 8; ss++) {
				var src_idx1 = sb18 + 17 - ss;
				var src_idx2 = sb18 + 18 + ss;
				var bu = out_1d[src_idx1];
				var bd = out_1d[src_idx2];
				out_1d[src_idx1] = (bu * MP3Layer3.cs[ss]) - (bd * MP3Layer3.ca[ss]);
				out_1d[src_idx2] = (bd * MP3Layer3.cs[ss]) + (bu * MP3Layer3.ca[ss]);
			}
		}
	}
	var tsOutCopy = new Float32Array(18);
	var rawout = new Float32Array(36);
	function arraycopy(_in, a, out, b, c) {
		var _ = 0;
		for (var i = b; i < c; i++) {
			out[i] = _in[a + _];
			_++;
		}
	}
	MP3Layer3.prototype.hybrid = function(ch, gr) {
		var si = this.si;
		var out_1d = this.out_1d;
		var bt = 0;
		var sb18 = 0;
		var gr_info = (si.ch[ch].gr[gr]);
		var tsOut = null;
		var prvblk = null;
		for (sb18 = 0; sb18 < 576; sb18 += 18) {
			bt = ((gr_info.window_switching_flag != 0) && (gr_info.mixed_block_flag != 0) && (sb18 < 36)) ? 0 : gr_info.block_type;
			tsOut = out_1d;
			arraycopy(tsOut, 0 + sb18, tsOutCopy, 0, 18);
			this.inv_mdct(tsOutCopy, rawout, bt);
			arraycopy(tsOutCopy, 0, tsOut, 0 + sb18, 18);
			prvblk = this.prevblck;
			tsOut[0 + sb18] = rawout[0] + prvblk[ch][sb18 + 0];
			prvblk[ch][sb18 + 0] = rawout[18];
			tsOut[1 + sb18] = rawout[1] + prvblk[ch][sb18 + 1];
			prvblk[ch][sb18 + 1] = rawout[19];
			tsOut[2 + sb18] = rawout[2] + prvblk[ch][sb18 + 2];
			prvblk[ch][sb18 + 2] = rawout[20];
			tsOut[3 + sb18] = rawout[3] + prvblk[ch][sb18 + 3];
			prvblk[ch][sb18 + 3] = rawout[21];
			tsOut[4 + sb18] = rawout[4] + prvblk[ch][sb18 + 4];
			prvblk[ch][sb18 + 4] = rawout[22];
			tsOut[5 + sb18] = rawout[5] + prvblk[ch][sb18 + 5];
			prvblk[ch][sb18 + 5] = rawout[23];
			tsOut[6 + sb18] = rawout[6] + prvblk[ch][sb18 + 6];
			prvblk[ch][sb18 + 6] = rawout[24];
			tsOut[7 + sb18] = rawout[7] + prvblk[ch][sb18 + 7];
			prvblk[ch][sb18 + 7] = rawout[25];
			tsOut[8 + sb18] = rawout[8] + prvblk[ch][sb18 + 8];
			prvblk[ch][sb18 + 8] = rawout[26];
			tsOut[9 + sb18] = rawout[9] + prvblk[ch][sb18 + 9];
			prvblk[ch][sb18 + 9] = rawout[27];
			tsOut[10 + sb18] = rawout[10] + prvblk[ch][sb18 + 10];
			prvblk[ch][sb18 + 10] = rawout[28];
			tsOut[11 + sb18] = rawout[11] + prvblk[ch][sb18 + 11];
			prvblk[ch][sb18 + 11] = rawout[29];
			tsOut[12 + sb18] = rawout[12] + prvblk[ch][sb18 + 12];
			prvblk[ch][sb18 + 12] = rawout[30];
			tsOut[13 + sb18] = rawout[13] + prvblk[ch][sb18 + 13];
			prvblk[ch][sb18 + 13] = rawout[31];
			tsOut[14 + sb18] = rawout[14] + prvblk[ch][sb18 + 14];
			prvblk[ch][sb18 + 14] = rawout[32];
			tsOut[15 + sb18] = rawout[15] + prvblk[ch][sb18 + 15];
			prvblk[ch][sb18 + 15] = rawout[33];
			tsOut[16 + sb18] = rawout[16] + prvblk[ch][sb18 + 16];
			prvblk[ch][sb18 + 16] = rawout[34];
			tsOut[17 + sb18] = rawout[17] + prvblk[ch][sb18 + 17];
			prvblk[ch][sb18 + 17] = rawout[35];
		}
	}
	MP3Layer3.win = [new Float32Array([-1.6141214951E-02, -5.3603178919E-02, -1.0070713296E-01, -1.6280817573E-01, -4.9999999679E-01, -3.8388735032E-01, -6.2061144372E-01, -1.1659756083E+00, -3.8720752656E+00, -4.2256286556E+00, -1.5195289984E+00, -9.7416483388E-01, -7.3744074053E-01, -1.2071067773E+00, -5.1636156596E-01, -4.5426052317E-01, -4.0715656898E-01, -3.6969460527E-01, -3.3876269197E-01, -3.1242222492E-01, -2.8939587111E-01, -2.6880081906E-01, -5.0000000266E-01, -2.3251417468E-01, -2.1596714708E-01, -2.0004979098E-01, -1.8449493497E-01, -1.6905846094E-01, -1.5350360518E-01, -1.3758624925E-01, -1.2103922149E-01, -2.0710679058E-01, -8.4752577594E-02, -6.4157525656E-02, -4.1131172614E-02, -1.4790705759E-02]), new Float32Array([-1.6141214951E-02, -5.3603178919E-02, -1.0070713296E-01, -1.6280817573E-01, -4.9999999679E-01, -3.8388735032E-01, -6.2061144372E-01, -1.1659756083E+00, -3.8720752656E+00, -4.2256286556E+00, -1.5195289984E+00, -9.7416483388E-01, -7.3744074053E-01, -1.2071067773E+00, -5.1636156596E-01, -4.5426052317E-01, -4.0715656898E-01, -3.6969460527E-01, -3.3908542600E-01, -3.1511810350E-01, -2.9642226150E-01, -2.8184548650E-01, -5.4119610000E-01, -2.6213228100E-01, -2.5387916537E-01, -2.3296291359E-01, -1.9852728987E-01, -1.5233534808E-01, -9.6496400054E-02, -3.3423828516E-02, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00]), new Float32Array([-4.8300800645E-02, -1.5715656932E-01, -2.8325045177E-01, -4.2953747763E-01, -1.2071067795E+00, -8.2426483178E-01, -1.1451749106E+00, -1.7695290101E+00, -4.5470225061E+00, -3.4890531002E+00, -7.3296292804E-01, -1.5076514758E-01, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00]), new Float32Array([0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, 0.0000000000E+00, -1.5076513660E-01, -7.3296291107E-01, -3.4890530566E+00, -4.5470224727E+00, -1.7695290031E+00, -1.1451749092E+00, -8.3137738100E-01, -1.3065629650E+00, -5.4142014250E-01, -4.6528974900E-01, -4.1066990750E-01, -3.7004680800E-01, -3.3876269197E-01, -3.1242222492E-01, -2.8939587111E-01, -2.6880081906E-01, -5.0000000266E-01, -2.3251417468E-01, -2.1596714708E-01, -2.0004979098E-01, -1.8449493497E-01, -1.6905846094E-01, -1.5350360518E-01, -1.3758624925E-01, -1.2103922149E-01, -2.0710679058E-01, -8.4752577594E-02, -6.4157525656E-02, -4.1131172614E-02, -1.4790705759E-02])];
	MP3Layer3.prototype.inv_mdct = function(_in, out, block_type) {
		var win_bt = 0;
		var i = 0;
		var tmpf_0, tmpf_1, tmpf_2, tmpf_3, tmpf_4, tmpf_5, tmpf_6, tmpf_7, tmpf_8, tmpf_9;
		var tmpf_10, tmpf_11, tmpf_12, tmpf_13, tmpf_14, tmpf_15, tmpf_16, tmpf_17;
		tmpf_0 = tmpf_1 = tmpf_2 = tmpf_3 = tmpf_4 = tmpf_5 = tmpf_6 = tmpf_7 = tmpf_8 = tmpf_9 = tmpf_10 = tmpf_11 = tmpf_12 = tmpf_13 = tmpf_14 = tmpf_15 = tmpf_16 = tmpf_17 = 0.0;
		if (block_type == 2) {
			out[0] = 0.0;
			out[1] = 0.0;
			out[2] = 0.0;
			out[3] = 0.0;
			out[4] = 0.0;
			out[5] = 0.0;
			out[6] = 0.0;
			out[7] = 0.0;
			out[8] = 0.0;
			out[9] = 0.0;
			out[10] = 0.0;
			out[11] = 0.0;
			out[12] = 0.0;
			out[13] = 0.0;
			out[14] = 0.0;
			out[15] = 0.0;
			out[16] = 0.0;
			out[17] = 0.0;
			out[18] = 0.0;
			out[19] = 0.0;
			out[20] = 0.0;
			out[21] = 0.0;
			out[22] = 0.0;
			out[23] = 0.0;
			out[24] = 0.0;
			out[25] = 0.0;
			out[26] = 0.0;
			out[27] = 0.0;
			out[28] = 0.0;
			out[29] = 0.0;
			out[30] = 0.0;
			out[31] = 0.0;
			out[32] = 0.0;
			out[33] = 0.0;
			out[34] = 0.0;
			out[35] = 0.0;
			var six_i = 0;
			for (i = 0; i < 3; i++) {
				_in[15 + i] += _in[12 + i];
				_in[12 + i] += _in[9 + i];
				_in[9 + i] += _in[6 + i];
				_in[6 + i] += _in[3 + i];
				_in[3 + i] += _in[0 + i];
				_in[15 + i] += _in[9 + i];
				_in[9 + i] += _in[3 + i];
				var pp1, pp2, sum = 0;
				pp2 = _in[12 + i] * 0.500000000;
				pp1 = _in[6 + i] * 0.866025403;
				sum = _in[0 + i] + pp2;
				tmpf_1 = _in[0 + i] - _in[12 + i];
				tmpf_0 = sum + pp1;
				tmpf_2 = sum - pp1;
				pp2 = _in[15 + i] * 0.500000000;
				pp1 = _in[9 + i] * 0.866025403;
				sum = _in[3 + i] + pp2;
				tmpf_4 = _in[3 + i] - _in[15 + i];
				tmpf_5 = sum + pp1;
				tmpf_3 = sum - pp1;
				tmpf_3 *= 1.931851653;
				tmpf_4 *= 0.707106781;
				tmpf_5 *= 0.517638090;
				var save = tmpf_0;
				tmpf_0 += tmpf_5;
				tmpf_5 = save - tmpf_5;
				save = tmpf_1;
				tmpf_1 += tmpf_4;
				tmpf_4 = save - tmpf_4;
				save = tmpf_2;
				tmpf_2 += tmpf_3;
				tmpf_3 = save - tmpf_3;
				tmpf_0 *= 0.504314480;
				tmpf_1 *= 0.541196100;
				tmpf_2 *= 0.630236207;
				tmpf_3 *= 0.821339815;
				tmpf_4 *= 1.306562965;
				tmpf_5 *= 3.830648788;
				tmpf_8 = -tmpf_0 * 0.793353340;
				tmpf_9 = -tmpf_0 * 0.608761429;
				tmpf_7 = -tmpf_1 * 0.923879532;
				tmpf_10 = -tmpf_1 * 0.382683432;
				tmpf_6 = -tmpf_2 * 0.991444861;
				tmpf_11 = -tmpf_2 * 0.130526192;
				tmpf_0 = tmpf_3;
				tmpf_1 = tmpf_4 * 0.382683432;
				tmpf_2 = tmpf_5 * 0.608761429;
				tmpf_3 = -tmpf_5 * 0.793353340;
				tmpf_4 = -tmpf_4 * 0.923879532;
				tmpf_5 = -tmpf_0 * 0.991444861;
				tmpf_0 *= 0.130526192;
				out[six_i + 6] += tmpf_0;
				out[six_i + 7] += tmpf_1;
				out[six_i + 8] += tmpf_2;
				out[six_i + 9] += tmpf_3;
				out[six_i + 10] += tmpf_4;
				out[six_i + 11] += tmpf_5;
				out[six_i + 12] += tmpf_6;
				out[six_i + 13] += tmpf_7;
				out[six_i + 14] += tmpf_8;
				out[six_i + 15] += tmpf_9;
				out[six_i + 16] += tmpf_10;
				out[six_i + 17] += tmpf_11;
				six_i += 6;
			}
		} else {
			_in[17] += _in[16];
			_in[16] += _in[15];
			_in[15] += _in[14];
			_in[14] += _in[13];
			_in[13] += _in[12];
			_in[12] += _in[11];
			_in[11] += _in[10];
			_in[10] += _in[9];
			_in[9] += _in[8];
			_in[8] += _in[7];
			_in[7] += _in[6];
			_in[6] += _in[5];
			_in[5] += _in[4];
			_in[4] += _in[3];
			_in[3] += _in[2];
			_in[2] += _in[1];
			_in[1] += _in[0];
			_in[17] += _in[15];
			_in[15] += _in[13];
			_in[13] += _in[11];
			_in[11] += _in[9];
			_in[9] += _in[7];
			_in[7] += _in[5];
			_in[5] += _in[3];
			_in[3] += _in[1];
			var tmp0 = 0, tmp1 = 0, tmp2 = 0, tmp3 = 0, tmp4 = 0, tmp0_ = 0, tmp1_ = 0, tmp2_ = 0, tmp3_ = 0;
			var tmp0o, tmp1o, tmp2o, tmp3o, tmp4o, tmp0_o, tmp1_o, tmp2_o, tmp3_o = 0;
			var i00 = _in[0] + _in[0];
			var iip12 = i00 + _in[12];
			tmp0 = iip12 + _in[4] * 1.8793852415718 + _in[8] * 1.532088886238 + _in[16] * 0.34729635533386;
			tmp1 = i00 + _in[4] - _in[8] - _in[12] - _in[12] - _in[16];
			tmp2 = iip12 - _in[4] * 0.34729635533386 - _in[8] * 1.8793852415718 + _in[16] * 1.532088886238;
			tmp3 = iip12 - _in[4] * 1.532088886238 + _in[8] * 0.34729635533386 - _in[16] * 1.8793852415718;
			tmp4 = _in[0] - _in[4] + _in[8] - _in[12] + _in[16];
			var i66_ = _in[6] * 1.732050808;
			tmp0_ = _in[2] * 1.9696155060244 + i66_ + _in[10] * 1.2855752193731 + _in[14] * 0.68404028665134;
			tmp1_ = (_in[2] - _in[10] - _in[14]) * 1.732050808;
			tmp2_ = _in[2] * 1.2855752193731 - i66_ - _in[10] * 0.68404028665134 + _in[14] * 1.9696155060244;
			tmp3_ = _in[2] * 0.68404028665134 - i66_ + _in[10] * 1.9696155060244 - _in[14] * 1.2855752193731;
			var i0 = _in[0 + 1] + _in[0 + 1];
			var i0p12 = i0 + _in[12 + 1];
			tmp0o = i0p12 + _in[4 + 1] * 1.8793852415718 + _in[8 + 1] * 1.532088886238 + _in[16 + 1] * 0.34729635533386;
			tmp1o = i0 + _in[4 + 1] - _in[8 + 1] - _in[12 + 1] - _in[12 + 1] - _in[16 + 1];
			tmp2o = i0p12 - _in[4 + 1] * 0.34729635533386 - _in[8 + 1] * 1.8793852415718 + _in[16 + 1] * 1.532088886238;
			tmp3o = i0p12 - _in[4 + 1] * 1.532088886238 + _in[8 + 1] * 0.34729635533386 - _in[16 + 1] * 1.8793852415718;
			tmp4o = (_in[0 + 1] - _in[4 + 1] + _in[8 + 1] - _in[12 + 1] + _in[16 + 1]) * 0.707106781; // Twiddled
			var i6_ = _in[6 + 1] * 1.732050808;
			tmp0_o = _in[2 + 1] * 1.9696155060244 + i6_ + _in[10 + 1] * 1.2855752193731 + _in[14 + 1] * 0.68404028665134;
			tmp1_o = (_in[2 + 1] - _in[10 + 1] - _in[14 + 1]) * 1.732050808;
			tmp2_o = _in[2 + 1] * 1.2855752193731 - i6_ - _in[10 + 1] * 0.68404028665134 + _in[14 + 1] * 1.9696155060244;
			tmp3_o = _in[2 + 1] * 0.68404028665134 - i6_ + _in[10 + 1] * 1.9696155060244 - _in[14 + 1] * 1.2855752193731;
			var e, o = 0;
			e = tmp0 + tmp0_;
			o = (tmp0o + tmp0_o) * 0.501909918;
			tmpf_0 = e + o;
			tmpf_17 = e - o;
			e = tmp1 + tmp1_;
			o = (tmp1o + tmp1_o) * 0.517638090;
			tmpf_1 = e + o;
			tmpf_16 = e - o;
			e = tmp2 + tmp2_;
			o = (tmp2o + tmp2_o) * 0.551688959;
			tmpf_2 = e + o;
			tmpf_15 = e - o;
			e = tmp3 + tmp3_;
			o = (tmp3o + tmp3_o) * 0.610387294;
			tmpf_3 = e + o;
			tmpf_14 = e - o;
			tmpf_4 = tmp4 + tmp4o;
			tmpf_13 = tmp4 - tmp4o;
			e = tmp3 - tmp3_;
			o = (tmp3o - tmp3_o) * 0.871723397;
			tmpf_5 = e + o;
			tmpf_12 = e - o;
			e = tmp2 - tmp2_;
			o = (tmp2o - tmp2_o) * 1.183100792;
			tmpf_6 = e + o;
			tmpf_11 = e - o;
			e = tmp1 - tmp1_;
			o = (tmp1o - tmp1_o) * 1.931851653;
			tmpf_7 = e + o;
			tmpf_10 = e - o;
			e = tmp0 - tmp0_;
			o = (tmp0o - tmp0_o) * 5.736856623;
			tmpf_8 = e + o;
			tmpf_9 = e - o;
			win_bt = MP3Layer3.win[block_type];
			out[0] = -tmpf_9 * win_bt[0];
			out[1] = -tmpf_10 * win_bt[1];
			out[2] = -tmpf_11 * win_bt[2];
			out[3] = -tmpf_12 * win_bt[3];
			out[4] = -tmpf_13 * win_bt[4];
			out[5] = -tmpf_14 * win_bt[5];
			out[6] = -tmpf_15 * win_bt[6];
			out[7] = -tmpf_16 * win_bt[7];
			out[8] = -tmpf_17 * win_bt[8];
			out[9] = tmpf_17 * win_bt[9];
			out[10] = tmpf_16 * win_bt[10];
			out[11] = tmpf_15 * win_bt[11];
			out[12] = tmpf_14 * win_bt[12];
			out[13] = tmpf_13 * win_bt[13];
			out[14] = tmpf_12 * win_bt[14];
			out[15] = tmpf_11 * win_bt[15];
			out[16] = tmpf_10 * win_bt[16];
			out[17] = tmpf_9 * win_bt[17];
			out[18] = tmpf_8 * win_bt[18];
			out[19] = tmpf_7 * win_bt[19];
			out[20] = tmpf_6 * win_bt[20];
			out[21] = tmpf_5 * win_bt[21];
			out[22] = tmpf_4 * win_bt[22];
			out[23] = tmpf_3 * win_bt[23];
			out[24] = tmpf_2 * win_bt[24];
			out[25] = tmpf_1 * win_bt[25];
			out[26] = tmpf_0 * win_bt[26];
			out[27] = tmpf_0 * win_bt[27];
			out[28] = tmpf_1 * win_bt[28];
			out[29] = tmpf_2 * win_bt[29];
			out[30] = tmpf_3 * win_bt[30];
			out[31] = tmpf_4 * win_bt[31];
			out[32] = tmpf_5 * win_bt[32];
			out[33] = tmpf_6 * win_bt[33];
			out[34] = tmpf_7 * win_bt[34];
			out[35] = tmpf_8 * win_bt[35];
		}
	}
	const SampleBuffer = function(sample_frequency, number_of_channels) {
		this.buffer = new Int16Array(SampleBuffer.OBUFFERSIZE);
		this.bufferp = new Int32Array(SampleBuffer.MAXCHANNELS);
		this.channels = number_of_channels;
		this.frequency = sample_frequency;
		for (var i = 0; i < number_of_channels; ++i)
			this.bufferp[i] = i;
	}
	SampleBuffer.OBUFFERSIZE = 2 * 1152;
	SampleBuffer.MAXCHANNELS = 2;
	SampleBuffer.prototype.getChannelCount = function() {
		return this.channels;
	}
	SampleBuffer.prototype.getSampleFrequency = function() {
		return this.frequency;
	}
	SampleBuffer.prototype.getBuffer = function() {
		return this.buffer;
	}
	SampleBuffer.prototype.getBufferLength = function() {
		return this.bufferp[0];
	}
	SampleBuffer.prototype.write_buffer = function() {
	}
	SampleBuffer.prototype.clear_buffer = function() {
		for (var i = 0; i < this.channels; ++i)
			this.bufferp[i] = i;
	}
	SampleBuffer.prototype.appendSamples = function(channel, f) {
		var pos = this.bufferp[channel];
		var s;
		var fs;
		for (var i = 0; i < 32; ) {
			fs = f[i++];
			fs = (fs > 32767.0 ? 32767.0 : (Math.max(fs, -32767.0)));
			s = fs << 16 >> 16;
			this.buffer[pos] = s;
			pos += this.channels;
		}
		this.bufferp[channel] = pos;
	}
	const MP3Decoder = function() {
		this.output = null;
		this.initialized = false;
	}
	MP3Decoder.prototype.setOutputBuffer = function(out) {
		this.output = out;
	}
	MP3Decoder.prototype.initialize = function(header) {
		var scalefactor = 32700;
		var mode = header.mode();
		var channels = mode == MP3Header.SINGLE_CHANNEL ? 1 : 2;
		if (this.output == null) this.output = new SampleBuffer(header.frequency(), channels);
		this.filter1 = new SynthesisFilter(0, scalefactor, null);
		if (channels == 2) this.filter2 = new SynthesisFilter(1, scalefactor, null);
		this.outputChannels = channels;
		this.outputFrequency = header.frequency();
		this.initialized = true;
	}
	MP3Decoder.prototype.decodeFrame = function(header, stream) {
		if (!this.initialized) {
			this.initialize(header);
		}
		this.output.clear_buffer();
		var decoder = this.retrieveDecoder(header, stream);
		decoder.decodeFrame();
		this.output.write_buffer(1);
		return this.output;
	}
	MP3Decoder.prototype.retrieveDecoder = function(header, stream) {
		if (this.l3decoder == null) {
			this.l3decoder = new MP3Layer3(stream, header, this.filter1, this.filter2, this.output);
		}
		return this.l3decoder;
	}
	return {
		Decoder: MP3Decoder,
		Header: MP3Header,
		BitStream
	}
}());

/*
 * Nellymoser JS
 *
 * A pure Javascript for the Nellymoser audio codec.
 *
 * credit to JPEXS
 *
 * (c) 2024 ATFSMedia Productions.
 *
 * Made in Peru
 */
var AT_Nellymoser_Decoder = (function() {const _1 = function() {this.bytePos = 0, this.bitPos = 0};_1.prototype.push = function(val, len, buf) {if (this.bitPos == 0) buf[this.bytePos] = val;else buf[this.bytePos] |= val << this.bitPos;this.bitPos += len;if (this.bitPos >= 8) {this.bytePos++;this.bitPos -= 8;if (this.bitPos > 0) buf[this.bytePos] = (val >> (len - this.bitPos));}},_1.prototype.pop = function(a, b) {let c = (b[this.bytePos] & 0xff) >> this.bitPos, d = 8 - this.bitPos;if (a >= d) {this.bytePos++;if (a > d) c |= b[this.bytePos] << d;};this.bitPos = (this.bitPos + a) & 7;return c & ((1 << a) - 1);};const _2 = function(a) {this.value = 0,this.scale = 0;if (a == 0) {this.value = a, this.scale = 31;return} else if (a >= (1 << 30)) {this.value = 0, this.scale = 0;return}let v = a, s = 0;if (v > 0) {do v <<= 1, ++s;while (v < (1 << 30));} else {let b = 1 << 31;do v <<= 1, ++s;while (v > b + (1 << 30));};this.value = v, this.scale = s}, _o1 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 37, 43, 49, 56, 64, 73, 83, 95, 109, 124], _o2 = [6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0], _t0 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 8, 9, 10, 12, 14, 15, 0], _t1 = [3134, 5342, 6870, 7792, 8569, 9185, 9744, 10191, 10631, 11061, 11434, 11770, 12116, 12513, 12925, 13300, 13674, 14027, 14352, 14716, 15117, 15477, 15824, 16157, 16513, 16804, 17090, 17401, 17679, 17948, 18238, 18520, 18764, 19078, 19381, 19640, 19921, 20205, 20500, 20813, 21162, 21465, 21794, 22137, 22453, 22756, 23067, 23350, 23636, 23926, 24227, 24521, 24819, 25107, 25414, 25730, 26120, 26497, 26895, 27344, 27877, 28463, 29426, 31355], _t2 = [-11725, -9420, -7910, -6801, -5948, -5233, -4599, -4039, -3507, -3030, -2596, -2170, -1774, -1383, -1016, -660, -329, -1, 337, 696, 1085, 1512, 1962, 2433, 2968, 3569, 4314, 5279, 6622, 8154, 10076, 12975], _t3 = [0, -0.847256005, 0.722470999, -1.52474797, -0.453148007, 0.375360996, 1.47178996, -1.98225796, -1.19293797, -0.582937002, -0.0693780035, 0.390956998, 0.906920016, 1.486274, 2.22154093, -2.38878703, -1.80675399, -1.41054201, -1.07736099, -0.799501002, -0.555810988, -0.333402008, -0.132449001, 0.0568020009, 0.254877001, 0.477355003, 0.738685012, 1.04430604, 1.39544594, 1.80987501, 2.39187598, -2.38938308, -1.98846805, -1.75140405, -1.56431198, -1.39221299, -1.216465, -1.04694998, -0.890510023, -0.764558017, -0.645457983, -0.52592802, -0.405954987, -0.302971989, -0.209690005, -0.123986997, -0.0479229987, 0.025773, 0.100134, 0.173718005, 0.258554012, 0.352290004, 0.456988007, 0.576775014, 0.700316012, 0.842552006, 1.00938797, 1.18213499, 1.35345602, 1.53208196, 1.73326194, 1.97223496, 2.39781404, -2.5756309, -2.05733204, -1.89849198, -1.77278101, -1.66626, -1.57421803, -1.49933195, -1.43166399, -1.36522806, -1.30009902, -1.22809303, -1.15885794, -1.09212506, -1.013574, -0.920284986, -0.828705013, -0.737488985, -0.644775987, -0.559094012, -0.485713989, -0.411031991, -0.345970005, -0.285115987, -0.234162003, -0.187058002, -0.144250005, -0.110716999, -0.0739680007, -0.0365610011, -0.00732900016, 0.0203610007, 0.0479039997, 0.0751969963, 0.0980999991, 0.122038998, 0.145899996, 0.169434994, 0.197045997, 0.225243002, 0.255686998, 0.287010014, 0.319709986, 0.352582991, 0.388906986, 0.433492005, 0.476945996, 0.520482004, 0.564453006, 0.612204015, 0.668592989, 0.734165013, 0.803215981, 0.878404021, 0.956620991, 1.03970695, 1.12937701, 1.22111595, 1.30802798, 1.40248001, 1.50568199, 1.62277305, 1.77249599, 1.94308805, 2.29039311, 0], _t4 = [0.999981225, 0.999529421, 0.998475611, 0.996820271, 0.994564593, 0.991709828, 0.988257587, 0.984210074, 0.979569793, 0.974339426, 0.968522072, 0.962121427, 0.955141187, 0.947585583, 0.939459205, 0.930767, 0.921513975, 0.911705971, 0.901348829, 0.890448689, 0.879012227, 0.867046177, 0.854557991, 0.841554999, 0.828045011, 0.81403631, 0.799537301, 0.784556627, 0.769103289, 0.753186822, 0.736816585, 0.720002472, 0.702754676, 0.685083687, 0.666999876, 0.64851439, 0.629638195, 0.610382795, 0.590759695, 0.570780694, 0.550458014, 0.529803574, 0.50883007, 0.487550199, 0.465976506, 0.444122106, 0.422000289, 0.399624199, 0.377007395, 0.354163498, 0.331106305, 0.307849586, 0.284407496, 0.260794103, 0.237023607, 0.213110298, 0.189068705, 0.164913103, 0.1406582, 0.116318598, 0.0919089988, 0.0674438998, 0.0429382995, 0.0184067003], _t5 = [0.125, 0.124962397, 0.124849401, 0.124661297, 0.124398097, 0.124059901, 0.123647101, 0.123159699, 0.122598201, 0.121962801, 0.1212539, 0.120471999, 0.119617499, 0.118690997, 0.117693, 0.116624102, 0.115484901, 0.114276201, 0.112998702, 0.111653, 0.110240199, 0.108760901, 0.107216097, 0.105606697, 0.103933699, 0.102198102, 0.100400902, 0.0985433012, 0.0966262966, 0.094651103, 0.0926188976, 0.0905309021, 0.0883883014, 0.0861926004, 0.0839449018, 0.0816465989, 0.0792991966, 0.076903902, 0.0744623989, 0.0719759986, 0.069446303, 0.0668746978, 0.0642627999, 0.0616123006, 0.0589246005, 0.0562013984, 0.0534444004, 0.0506552011, 0.0478353985, 0.0449868999, 0.0421111993, 0.0392102003, 0.0362856016, 0.0333391018, 0.0303725004, 0.0273876991, 0.0243862998, 0.0213702004, 0.0183412991, 0.0153013002, 0.0122520998, 0.0091955997, 0.00613350002, 0.00306769996], _t6 = [-0.00613590004, -0.0306748003, -0.0551952012, -0.0796824023, -0.104121603, -0.128498107, -0.152797207, -0.177004203, -0.201104596, -0.225083902, -0.248927593, -0.272621393, -0.296150893, -0.319501996, -0.342660695, -0.365613014, -0.388345003, -0.410843194, -0.433093786, -0.455083609, -0.47679919, -0.498227686, -0.519356012, -0.540171504, -0.560661614, -0.580814004, -0.600616515, -0.620057225, -0.639124393, -0.657806695, -0.676092684, -0.693971515, -0.711432219, -0.728464425, -0.745057821, -0.761202395, -0.77688849, -0.792106628, -0.806847572, -0.8211025, -0.834862888, -0.848120272, -0.860866904, -0.873094976, -0.884797096, -0.895966172, -0.906595707, -0.916679084, -0.926210225, -0.935183525, -0.943593502, -0.95143503, -0.958703518, -0.965394378, -0.971503913, -0.977028072, -0.981963873, -0.986308098, -0.990058184, -0.993211925, -0.995767415, -0.997723103, -0.999077678, -0.999830604], _t7 = [0.00613590004, 0.0184067003, 0.0306748003, 0.0429382995, 0.0551952012, 0.0674438998, 0.0796824023, 0.0919089988, 0.104121603, 0.116318598, 0.128498107, 0.1406582, 0.152797207, 0.164913103, 0.177004203, 0.189068705, 0.201104596, 0.213110298, 0.225083902, 0.237023607, 0.248927593, 0.260794103, 0.272621393, 0.284407496, 0.296150893, 0.307849586, 0.319501996, 0.331106305, 0.342660695, 0.354163498, 0.365613014, 0.377007395, 0.388345003, 0.399624199, 0.410843194, 0.422000289, 0.433093786, 0.444122106, 0.455083609, 0.465976506, 0.47679919, 0.487550199, 0.498227686, 0.50883007, 0.519356012, 0.529803574, 0.540171504, 0.550458014, 0.560661614, 0.570780694, 0.580814004, 0.590759695, 0.600616515, 0.610382795, 0.620057225, 0.629638195, 0.639124393, 0.64851439, 0.657806695, 0.666999876, 0.676092684, 0.685083687, 0.693971515, 0.702754676, 0.711432219, 0.720002472, 0.728464425, 0.736816585, 0.745057821, 0.753186822, 0.761202395, 0.769103289, 0.77688849, 0.784556627, 0.792106628, 0.799537301, 0.806847572, 0.81403631, 0.8211025, 0.828045011, 0.834862888, 0.841554999, 0.848120272, 0.854557991, 0.860866904, 0.867046177, 0.873094976, 0.879012227, 0.884797096, 0.890448689, 0.895966172, 0.901348829, 0.906595707, 0.911705971, 0.916679084, 0.921513975, 0.926210225, 0.930767, 0.935183525, 0.939459205, 0.943593502, 0.947585583, 0.95143503, 0.955141187, 0.958703518, 0.962121427, 0.965394378, 0.968522072, 0.971503913, 0.974339426, 0.977028072, 0.979569793, 0.981963873, 0.984210074, 0.986308098, 0.988257587, 0.990058184, 0.991709828, 0.993211925, 0.994564593, 0.995767415, 0.996820271, 0.997723103, 0.998475611, 0.999077678, 0.999529421, 0.999830604, 0.999981225], _t8 = [32767, 30840, 29127, 27594, 26214, 24966, 23831, 22795, 21845, 20972, 20165, 19418, 18725, 18079, 17476, 16913, 16384, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], _t9 = [0, 0.0122715384, 0.024541229, 0.0368072242, 0.0490676723, 0.061320737, 0.0735645667, 0.0857973099, 0.0980171412, 0.110222213, 0.122410677, 0.134580716, 0.146730468, 0.158858135, 0.170961887, 0.183039889, 0.195090324, 0.207111374, 0.219101235, 0.231058106, 0.242980182, 0.254865646, 0.266712755, 0.27851969, 0.290284693, 0.302005947, 0.313681751, 0.32531029, 0.336889863, 0.348418683, 0.359895051, 0.371317178, 0.382683426, 0.393992037, 0.405241311, 0.416429549, 0.427555084, 0.438616246, 0.449611336, 0.460538715, 0.471396744, 0.482183784, 0.492898196, 0.50353837, 0.514102757, 0.524589658, 0.534997642, 0.545324981, 0.555570245, 0.565731823, 0.575808167, 0.585797846, 0.59569931, 0.605511069, 0.615231574, 0.624859512, 0.634393275, 0.643831551, 0.653172851, 0.662415802, 0.671558976, 0.680601001, 0.689540565, 0.698376238, 0.707106769, 0.715730846, 0.724247098, 0.732654274, 0.740951121, 0.749136388, 0.757208824, 0.765167296, 0.773010433, 0.780737221, 0.78834641, 0.795836926, 0.803207517, 0.81045723, 0.817584813, 0.824589312, 0.831469595, 0.838224709, 0.84485358, 0.851355195, 0.857728601, 0.863972843, 0.870086968, 0.876070082, 0.881921232, 0.887639642, 0.893224299, 0.898674488, 0.903989315, 0.909168005, 0.914209783, 0.919113874, 0.923879504, 0.928506076, 0.932992816, 0.937339008, 0.941544056, 0.945607305, 0.949528158, 0.953306019, 0.956940353, 0.960430503, 0.963776052, 0.966976464, 0.970031261, 0.972939968, 0.975702107, 0.97831738, 0.980785251, 0.983105481, 0.985277653, 0.987301409, 0.989176512, 0.990902662, 0.992479503, 0.993906975, 0.99518472, 0.996312618, 0.997290432, 0.998118103, 0.99879545, 0.999322355, 0.999698818, 0.999924719, 1], _3 = function(a) {this.value = 0,this.shift = 0;if (a == 124) {this.value = 4228, this.shift = 19;return;} else if (a == 0) {this.value = 0, this.shift = 0;return;}let b = ((~a >>> 31) << 1) - 1, c = a * b, d = -1;while ((c & (1 << 15)) == 0) c <<= 1, d++;c >>= 1;this.shift = 27 - d;let e = _t8[(c - 0x3e00) >> 10], f = c * e;f = (1 << 30) - f, f += (1 << 14), f >>= 15, f *= e, f += (1 << 14), f >>= 15;let g = f;f *= c, f = (1 << 29) - f, f += (1 << 14), f >>= 15, f *= g, f += (1 << 13), f >>= 14, f *= b;if (f > 32767 && b == 1) f = 32767;else if (f < -32768 && b == -1) f = -32768;this.value = f;}, _f1 = function(a, b, c, e, f) {var d = 0;if (c <= 0) return (d | 0);var g = 1 << (b - 1);for (var i = 0; i < c; ++i) {var h = a[i] - f;if (h < 0) h = 0;else h = (h + g) >> b;d += Math.min(h, e)};return (d | 0)}, _f2 = function(a, b, c, d) {var e = 0;for (var i = 0; i < b; ++i) if (a[i] > e) e = a[i];var f = 0, g = new _2(e);f = g.scale - 16;var h = new Int16Array(124);if (f < 0) for (var i = 0; i < b; ++i) h[i] = (a[i] >> -f);else for (var i = 0; i < b; ++i) h[i] = (a[i] << f);var k = new _3(b);for (var i = 0; i < b; ++i) h[i] = ((h[i] * 3) >> 2);var l = 0;for (var i = 0; i < b; ++i) l += h[i];f += 11, l -= c << f;var m = 0, n = l - (c << f);g = new _2(n),m = ((n >> 16) * k.value) >> 15;var o = 31 - k.shift - g.scale;if (o >= 0) m <<= o;else m >>= -o;var p = _f1(h, f, b, 6, m);if (p != c) {var a1 = (p - c), a2 = 0;if (a1 <= 0) for (; a1 >= -16384; a1 <<= 1) a2++;else for (; a1 < 16384; a1 <<= 1) a2++;var a3 = (a1 * k.value) >> 15;a2 = f - (k.shift + a2 - 15);if (a2 >= 0) a3 <<= a2;else a3 >>= -a2;var a4 = 1, b1 = 0, b2 = 0;for (; ; ) {b1 = p, b2 = m, m += a3, p = _f1(h, f, b, 6, m);if (++a4 > 19) break;if ((p - c) * (b1 - c) <= 0) break;};if (p != c) {var b3 = 0, b4 = 0, b5 = 0;if (p > c) b3 = m, m = b2, b4 = p, b5 = b1;else b3 = b2, b4 = b1, b5 = p;while (p != c && a4 < 20) {var c1 = (m + b3) >> 1;p = _f1(h, f, b, 6, c1);++a4;if (p > c) b3 = c1, b4 = p;else m = c1, b5 = p;}var c2 = Math.abs((b4 - c) | 0), c3 = Math.abs((b5 - c) | 0);if (c2 < c3) m = b3, p = b4;else p = b5;}};for (var i = 0; i < b; ++i) {var d1 = h[i] - m;if (d1 >= 0) d1 = (d1 + (1 << (f - 1))) >> f;else d1 = 0;d[i] = Math.min(d1, 6);};if (p > c) {var i = 0, d2 = 0;for (; d2 < c; ++i) d2 += d[i];d2 -= d[i - 1];d[i - 1] = c - d2;p = c;for (; i < b; ++i) d[i] = 0;};return (c - p) | 0;}, _f3 = function(a, b, c) {var f = c << 1, j = 1;for (var i = 1; i < f; i += 2) {if (i < j) {var d = a[b + i];a[b + i] = a[b + j], a[b + j] = d;var e = a[b + i - 1];a[b + i - 1] = a[b + j - 1], a[b + j - 1] = e}var x = c;while (x > 1 && x < j) j -= x, x >>= 1;j += x}}, _f4 = function(a, b, c) {var d = 1 << c, j = 0;_f3(a, b, d);for (var i = (d >> 1); i > 0; --i,j += 4) {var j0 = a[b + j], j1 = a[b + j + 1], j2 = a[b + j + 2], j3 = a[b + j + 3];a[b + j] = j0 + j2, a[b + j + 1] = j1 + j3, a[b + j + 2] = j0 - j2, a[b + j + 3] = j1 - j3};j = 0;for (var i = (d >> 2); i > 0; --i, j += 8) {var j0 = a[b + j], j1 = a[b + j + 1], j2 = a[b + j + 2], j3 = a[b + j + 3], j4 = a[b + j + 4], j5 = a[b + j + 5], j6 = a[b + j + 6], j7 = a[b + j + 7];a[b + j] = j0 + j4, a[b + j + 1] = j1 + j5, a[b + j + 2] = j2 + j7, a[b + j + 3] = j3 - j6, a[b + j + 4] = j0 - j4, a[b + j + 5] = j1 - j5, a[b + j + 6] = j2 - j7, a[b + j + 7] = j3 + j6}var i = 0, x = (d >> 3), y = 64, z = 4;for (var idx1 = c - 2; idx1 > 0; --idx1, z <<= 1, y >>= 1, x >>= 1) {j = 0;for (var idx2 = x; idx2 != 0; --idx2, j += z << 1) {for (var idx3 = z >> 1; idx3 > 0; --idx3, j += 2, i += y) {var k = j + (z << 1), j0 = a[b + j], j1 = a[b + j + 1], k0 = a[b + k], k1 = a[b + k + 1];a[b + k] = (j0 - (k0 * _t9[128 - i] + k1 * _t9[i])), a[b + j] = (j0 + (k0 * _t9[128 - i] + k1 * _t9[i])), a[b + k + 1] = (j1 + (k0 * _t9[i] - k1 * _t9[128 - i])), a[b + j + 1] = (j1 - (k0 * _t9[i] - k1 * _t9[128 - i]))};for (var idx4 = z >> 1; idx4 > 0; --idx4, j += 2, i -= y) {var k = j + (z << 1), j0 = a[b + j], j1 = a[b + j + 1], k0 = a[b + k], k1 = a[b + k + 1];a[b + k] = (j0 + (k0 * _t9[128 - i] - k1 * _t9[i])), a[b + j] = (j0 - (k0 * _t9[128 - i] - k1 * _t9[i])), a[b + k + 1] = (j1 + (k1 * _t9[128 - i] + k0 * _t9[i])), a[b + j + 1] = (j1 - (k1 * _t9[128 - i] + k0 * _t9[i]))}}}}, _f5 = function(a, b, c, d, e) {var f = 1 << c, g = (f >> 1) - 1, h = f >> 2;for (var i = 0; i < h; ++i) {var i2 = i << 1, j = f - 1 - i2, k = j - 1, in_i2 = a[b + i2], in_i2_1 = a[b + i2 + 1], in_j = a[b + j], in_k = a[b + k];d[e + i2] = (_t4[i] * in_i2 - _t6[i] * in_j), d[e + i2 + 1] = (in_j * _t4[i] + in_i2 * _t6[i]), d[e + k] = (_t4[g - i] * in_k - _t6[g - i] * in_i2_1), d[e + j] = (in_i2_1 * _t4[g - i] + in_k * _t6[g - i]);};_f4(d, e, c - 1);var l = d[e + f - 1], m = d[e + f - 2];d[e] = _t5[0] * d[e], d[e + f - 1] = d[e + 1] * -_t5[0], d[e + f - 2] = _t5[g] * d[e + f - 2] + _t5[1] * l, d[e + 1] = m * _t5[1] - l * _t5[g];var o = f - 3, p = g, j = 3;for (var i = 1; i < h; ++i, --p, o -= 2, j += 2) {var q = d[e + o], r = d[e + o - 1], s = d[e + j], t = d[e + j - 1];d[e + j - 1] = (_t5[p] * s + _t5[(j - 1) >> 1] * t), d[e + j] = (r * _t5[(j + 1) >> 1] - q * _t5[p - 1]), d[e + o] = (t * _t5[p] - s * _t5[(j - 1) >> 1]), d[e + o - 1] = (_t5[(j + 1) >> 1] * q + _t5[p - 1] * r);}}, _f6 = function(a, b, c, d, e) {var f = 1 << c, g = f >> 2, y = f - 1, x = f >> 1, j = x - 1, i = 0;_f5(b, 0, c, d, e);for (; i < g; ++i, --j, ++x, --y) {var h = a[i], k = a[j], l = d[e + x], m = d[e + y];a[i] = -d[e + j], a[j] = -d[e + i], d[e + i] = (h * _t7[y] + l * _t7[i]), d[e + j] = (k * _t7[x] + m * _t7[j]), d[e + x] = (_t7[x] * -m + _t7[j] * k), d[e + y] = (_t7[y] * -l + _t7[i] * h);}}, _f7 = function(a, b, c) {const d = new Uint8Array(124), e1 = new Float32Array(128), e2 = new Float32Array(124), e3 = new Float32Array(124), f = new Int32Array(124), o = new _1;var g = o.pop(_o2[0], b);d[0] = g, e1[0] = _t1[g];for (var i = 1; i < 23; i++) g = o.pop(_o2[i], b), d[i] = g, e1[i] = e1[i - 1] + _t2[g];for (var i = 0; i < 23; i++) {var h = Math.pow(2.0, e1[i] * (0.5 * 0.0009765625)), k = _o1[i], l = _o1[i + 1];for (; k < l; ++k) e3[k] = e1[i], e2[k] = h;}var m = _f2(e3, 124, 198, f);for (var n = 0; n < 256; n += 128) {for (var i = 0; i < 124; ++i) {let h = f[i], k = e2[i];if (h > 0) {let l = 1 << h;g = o.pop(h, b), d[i] = g, k *= _t3[l - 1 + g]} else {var p = Math.random() * 4294967296.0;if (p < (1 << 30) + (1 << 14)) k *= -0.707099974;else k *= 0.707099974;}e1[i] = k;};for (var i = 124; i < 128; ++i) e1[i] = 0;for (var i = m; i > 0; i -= 8) {if (i > 8) o.pop(8, b);else {o.pop(i, b);break;}};_f6(a, e1, 7, c, n);}}, _f8 = function(a, b, c, d) {var e = 0;var f = Math.abs(a - b[c]);for (var i = c; i < d; ++i) {var g = Math.abs(a - b[i]);if (g < f) f = g, e = i - c;};return e}, _f9 = function(a, b, c, d) {var e = c, f = d;do {var g = (e + f) >> 1;if (a > b[g]) e = g;else f = g;} while (f - e > 1);if (f != d) if (a - b[e] > b[f] - a) e = f;return e - c}, _f10 = function(a, b, c, d, e, f) { var g = 1 << d, h = g >> 2, y = g - 1, x = g >> 1, j = x - 1, i = 0;for (; i < h; ++i, ++x, --y, --j) e[f + x] = a[i], e[f + y] = a[j], e[f + i] = -b[c + j] * _t7[x] - b[c + x] * _t7[j], e[f + j] = -b[c + y] * _t7[i] - b[c + i] * _t7[y], a[i] = b[c + i] * _t7[i] - b[c + y] * _t7[y], a[j] = b[c + j] * _t7[j] - b[c + x] * _t7[x];_f5(e, f, d, e, f);}, _f11 = function(q, w, e) {const c = new Float32Array(256), d = new Float32Array(23), f = new Float32Array(23), g = new Float32Array(124), h = new Float32Array(124), j = new Int32Array(124), k = new _1;_f10(q, w, 0, 7, c, 0);_f10(q, w, 128, 7, c, 128);for (var i = 0; i < 23; ++i) {var l = _o1[i], m = _o1[i + 1], n = 0.0;for (; l < m; ++l) {var a = c[l], b = c[l + 128];n += a * a + b * b;};var o = Math.max(1.0, n / (_t0[i] << 1));d[i] = Math.round(Math.log(o) * (1.44269502 * 1024.0));};var r = _f8(d[0], _t1, 0, 64);f[0] = _t1[r];k.push(r, _o2[0], e);for (var i = 1; i < 23; ++i) {r = _f8(d[i] - f[i - 1], _t2, 0, 32);f[i] = f[i - 1] + _t2[r];k.push(r, _o2[i], e);}for (var i = 0; i < 23; ++i)d[i] = (1.0 / Math.pow(2.0, f[i] * (0.5 * 0.0009765625)));for (var i = 0; i < 23; ++i) {var l = _o1[i], m = _o1[i + 1];for (; l < m; ++l) g[l] = f[i], h[l] = d[i];}var s = _f2(g, 124, 198, j);for (var u = 0; u < 256; u += 128) {for (var i = 0; i < 124; ++i) {var p = j[i];if (p > 0) {var t = 1 << p;r = _f9(h[i] * c[u + i], _t3, t - 1, (t << 1) - 1);k.push(r, p, e);}}for (var i = s; i > 0; i -= 8) {if (i > 8) k.push(0, 8, e);else {k.push(0, i, e);break;}}}};return {decode: _f7,encode: _f11}}());

var AT_H263_Decoder = (function() {
	const saturatingSub = function(a, b) {
		return a - b;
	}
	const asU8 = function(num) {
		return (num << 24) >>> 24;
	}
	const asI8 = function(num) {
		return (num << 24) >> 24;
	}
	const asU16 = function(num) {
		return (num << 16) >>> 16;
	}
	const asI16 = function(num) {
		return (num << 16) >> 16;
	}
	const num_signum = function(num) {
		if (num > 0) {
			return 1;
		} else if (num == 0) {
			return 0;
		} else {
			return -1;
		}
	}
	function num_clamp(value, a, b) {
		return Math.max(Math.min(value, b), a);
	}
	function asfgdgdfg(value, min, max) {
		return (value >= min) && (value <= max);
	}
	function op_cmp(a, b) {
		if (a > b) {
			return "greater";
		} else if (a < b) {
			return "less";
		} else {
			return "equal";
		}
	}
	const is_eof_error = function(type) {
		return (type == "EndOfFile") || (type == "_");
	}
	class Picture {
		constructor() {
			this.version = 0;
			this.temporal_reference = 0;
			this.format = null;
			this.options = null;
			this.has_plusptype = false;
			this.has_opptype = false;
			this.picture_type = null;
			this.motion_vector_range = null;
			this.slice_submode = null;
			this.scalability_layer = null;
			this.reference_picture_selection_mode = null;
			this.prediction_reference = 0;
			this.backchannel_message = null;
			this.reference_picture_resampling = null;
			this.quantizer = 0;
			this.multiplex_bitstream = 0;
			this.pb_reference = 0;
			this.pb_quantizer = null;
			this.extra = [];
		}
	}
	class PixelAspectRatio {
		constructor(type, value) {
			this.type = type;
			this.value = (value || null);
		}
	}
	PixelAspectRatio.Square = 1;
	PixelAspectRatio.Par12_11 = 2;
	PixelAspectRatio.Par10_11 = 3;
	PixelAspectRatio.Par16_11 = 4;
	PixelAspectRatio.Par40_33 = 5;
	PixelAspectRatio.Reserved = 6;
	PixelAspectRatio.Extended = 7;
	class CustomPictureFormat {
		constructor(pixelAspectRatio, pictureWidthIndication, pictureHeightIndication) {
			this.pixelAspectRatio = pixelAspectRatio;
			this.pictureWidthIndication = pictureWidthIndication;
			this.pictureHeightIndication = pictureHeightIndication;
		}
	}
	class MotionVectorRange {
		constructor(type) {
			this.type = type;
		}
	}
	MotionVectorRange.Extended = 0;
	MotionVectorRange.Unlimited = 1;
	class SourceFormat {
		constructor(type, value) {
			this.type = type;
			this.value = (value || null);
		}
		intoWidthAndHeight() {
			switch (this.type) {
				case SourceFormat.SubQcif:
					return [128, 96];
				case SourceFormat.QuarterCif:
					return [176, 144];
				case SourceFormat.FullCif:
					return [352, 288];
				case SourceFormat.FourCif:
					return [704, 576];
				case SourceFormat.SixteenCif:
					return [1408, 1152];
				case SourceFormat.Reserved:
					return null;
				case SourceFormat.Extended:
					return [this.value.pictureWidthIndication, this.value.pictureHeightIndication];
			}
		}
	}
	SourceFormat.SubQcif = 1;
	SourceFormat.QuarterCif = 2;
	SourceFormat.FullCif = 3;
	SourceFormat.FourCif = 4;
	SourceFormat.SixteenCif = 5;
	SourceFormat.Reserved = 6;
	SourceFormat.Extended = 7;
	class PictureTypeCode {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
		is_any_pbframe() {
			return (this.type == PictureTypeCode.PbFrame) || (this.type == PictureTypeCode.ImprovedPbFrame);
		}
		is_disposable() {
			return this.type == PictureTypeCode.DisposablePFrame;
		}
		getType() {
			switch (this.type) {
				case PictureTypeCode.IFrame:
					return "IFrame";
				case PictureTypeCode.PFrame:
					return "PFrame";
				case PictureTypeCode.PbFrame:
					return "PbFrame";
				case PictureTypeCode.EiFrame:
					return "EiFrame";
				case PictureTypeCode.EpFrame:
					return "EpFrame";
				case PictureTypeCode.Reserved:
					return "Reserved";
				case PictureTypeCode.DisposablePFrame:
					return "DisposablePFrame";
			}
		}
	}
	PictureTypeCode.IFrame = 1;
	PictureTypeCode.PFrame = 2;
	PictureTypeCode.PbFrame = 3;
	PictureTypeCode.ImprovedPbFrame = 4;
	PictureTypeCode.BFrame = 5;
	PictureTypeCode.EiFrame = 6;
	PictureTypeCode.EpFrame = 7;
	PictureTypeCode.Reserved = 8;
	PictureTypeCode.DisposablePFrame = 9;
	class DecodedDctBlock {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	DecodedDctBlock.Zero = 1;
	DecodedDctBlock.Dc = 2;
	DecodedDctBlock.Horiz = 3;
	DecodedDctBlock.Vert = 4;
	DecodedDctBlock.Full = 5;
	class PictureOption {
		constructor() {
			this.USE_SPLIT_SCREEN = false;
			this.USE_DOCUMENT_CAMERA = false;
			this.RELEASE_FULL_PICTURE_FREEZE = false;
			this.UNRESTRICTED_MOTION_VECTORS = false;
			this.SYNTAX_BASED_ARITHMETIC_CODING = false;
			this.ADVANCED_PREDICTION = false;
			this.ADVANCED_INTRA_CODING = false;
			this.DEBLOCKING_FILTER = false;
			this.SLICE_STRUCTURED = false;
			this.REFERENCE_PICTURE_SELECTION = false;
			this.INDEPENDENT_SEGMENT_DECODING = false;
			this.ALTERNATIVE_INTER_VLC = false;
			this.MODIFIED_QUANTIZATION = false;
			this.REFERENCE_PICTURE_RESAMPLING = false;
			this.REDUCED_RESOLUTION_UPDATE = false;
			this.ROUNDING_TYPE_ONE = false;
			this.USE_DEBLOCKER = false;
		}
		static empty() {
			return new PictureOption();
		}
	}
	function decodeSorensonPType(reader) {
		var source_format, bit_count;
		var dgf = reader.readBits(3);
		switch(dgf) {
			case 0:
				source_format = null;
				bit_count = 8;
				break;
			case 1:
				source_format = null;
				bit_count = 16;
				break;
			case 2:
				source_format = new SourceFormat(SourceFormat.FullCif);
				bit_count = 0;
				break;
			case 3:
				source_format = new SourceFormat(SourceFormat.QuarterCif);
				bit_count = 0;
				break;
			case 4:
				source_format = new SourceFormat(SourceFormat.SubQcif);
				bit_count = 0;
				break;
			case 5:
				source_format = new SourceFormat(SourceFormat.Extended, new CustomPictureFormat(new PixelAspectRatio(PixelAspectRatio.Square), 320, 240));
				bit_count = 0;
				break;
			case 6:
				source_format = new SourceFormat(SourceFormat.Extended, new CustomPictureFormat(new PixelAspectRatio(PixelAspectRatio.Square), 160, 120));
				bit_count = 0;
				break;
			default:
				source_format = new SourceFormat(SourceFormat.Reserved);
				bit_count = 0;
		}
		if (source_format === null) {
			let customWidth = reader.readBits(bit_count);
			let customHeight = reader.readBits(bit_count);
			source_format = new SourceFormat(SourceFormat.Extended, new CustomPictureFormat(new PixelAspectRatio(PixelAspectRatio.Square), customWidth, customHeight));
		}
		var fdgd = reader.readBits(2);
		var pictureType;
		switch(fdgd) {
			case 0:
				pictureType = new PictureTypeCode(PictureTypeCode.IFrame);
				break;
			case 1:
				pictureType = new PictureTypeCode(PictureTypeCode.PFrame);
				break;
			case 2:
				pictureType = new PictureTypeCode(PictureTypeCode.DisposablePFrame);
				break;
			default:
				pictureType = new PictureTypeCode(PictureTypeCode.Reserved, fdgd);
				break;
		}
		let options = PictureOption.empty();
		if (reader.readBits(1) == 1) {
			options.USE_DEBLOCKER = true;
		}
		return [source_format, pictureType, options];
	}
	class DecodedPicture {
		constructor(picture_header, format) {
			let [w, h] = format.intoWidthAndHeight();
			let luma_samples = w * h;
			let luma = new Uint8Array(luma_samples);
			let chroma_w = Math.ceil(w / 2.0);
			let chroma_h = Math.ceil(h / 2.0);
			let chroma_samples = chroma_w * chroma_h;
			let chroma_b = new Uint8Array(chroma_samples);
			let chroma_r = new Uint8Array(chroma_samples);
			this.picture_header = picture_header;
			this.format = format;
			this.luma = luma;
			this.chroma_b = chroma_b;
			this.chroma_r = chroma_r;
			this.chroma_samples_per_row = chroma_w;
		}
		as_yuv() {
			return [this.luma, this.chroma_b, this.chroma_r];
		}
		as_header() {
			return this.picture_header;
		}
		as_luma_mut() {
			return this.luma;
		}
		as_chroma_b_mut() {
			return this.chroma_b;
		}
		as_chroma_r_mut() {
			return this.chroma_r;
		}
		as_luma() {
			return this.luma;
		}
		as_chroma_b() {
			return this.chroma_b;
		}
		as_chroma_r() {
			return this.chroma_r;
		}
		luma_samples_per_row() {
			return this.format.intoWidthAndHeight()[0];
		}
	}
	function decodePei(reader) {
		var data = [];
		while(true) {
			var hasPei = reader.readBits(1);
			if (hasPei == 1) {
				data.push(reader.readUint8());
			} else {
				break;
			}
		}
		return data;
	}
	function decodePicture(reader, decoderOptions, previous_picture) {
		var skippedBits = reader.recognizeStartCode(false);
		reader.skipBits(17 + skippedBits);
		var gob_id = reader.readBits(5);
		if (decoderOptions.sorensonSpark) {
			var temporalReference = reader.readUint8();
			var [source_format, pictureType, options] = decodeSorensonPType(reader);
			var quantizer = reader.readBits(5);
			var extra = decodePei(reader);
			var result = new Picture();
			result.version = gob_id;
			result.temporal_reference = temporalReference;
			result.format = source_format;
			result.options = options;
			result.has_plusptype = false;
			result.has_opptype = false;
			result.picture_type = pictureType;
			result.quantizer = quantizer;
			result.extra = extra;
			result.motion_vector_range = new MotionVectorRange(MotionVectorRange.Unlimited);
			result.slice_submode = null;
			result.scalability_layer = null;
			result.reference_picture_selection_mode = null;
			result.prediction_reference = null;
			result.backchannel_message = null;
			result.reference_picture_resampling = null;
			result.multiplex_bitstream = null;
			result.pb_reference = null;
			result.pb_quantizer = null;
			return result;
		}
	}
	class CodedBlockPattern {
		constructor(codes_luma, codes_chroma_b, codes_chroma_r) {
			this.codes_luma = codes_luma;
			this.codes_chroma_b = codes_chroma_b;
			this.codes_chroma_r = codes_chroma_r;
		}
	}
	class HalfPel {
		constructor(n) {
			this.n = n;
		}
		static zero() {
			return new HalfPel(0);
		}
		static from(float) {
			return new HalfPel(asI16(Math.floor(float * 2)));
		}
		static from_unit(unit) {
			return new HalfPel(asI16(unit));
		}
		is_mv_within_range(range) {
			return -range.n <= this.n && this.n < range.n;
		}
		invert() {
			switch (op_cmp(this.n, 0)) {
				case "greater":
					return new HalfPel(this.n - 64);
				case "less":
					return new HalfPel(this.n + 64);
				case "equal":
					return this;
			}
		}
		average_sum_of_mvs() {
			let whole = (this.n >> 4) << 1;
			let frac = this.n & 0x0F;
			if (asfgdgdfg(frac, 0, 2)) {
				return new HalfPel(whole);
			} else if (asfgdgdfg(frac, 14, 15)) {
				return new HalfPel(whole + 2);
			} else {
				return new HalfPel(whole + 1);
			}
		}
		median_of(mhs, rhs) {
			var num_self = this.n;
			var num_mhs = mhs.n;
			var num_rhs = rhs.n;
			if (num_self > num_mhs) {
				if (num_rhs > num_mhs) {
					if (num_rhs > num_self) {
						return this;
					} else {
						return rhs;
					}
				} else {
					return mhs;
				}
			} else if (num_mhs > num_rhs) {
				if (num_rhs > num_self) {
					return rhs;
				} else {
					return this;
				}
			} else {
				return mhs;
			}
		}
		into_lerp_parameters() {
			if (this.n % 2 == 0) {
				return [asI16(this.n / 2), false];
			} else if (this.n < 0) {
				return [asI16(this.n / 2 - 1), true];
			} else {
				return [asI16(this.n / 2), true];
			}
		}
	}
	HalfPel.STANDARD_RANGE = new HalfPel(32);
	HalfPel.EXTENDED_RANGE = new HalfPel(64);
	HalfPel.EXTENDED_RANGE_QUADCIF = new HalfPel(128);
	HalfPel.EXTENDED_RANGE_SIXTEENCIF = new HalfPel(256);
	HalfPel.EXTENDED_RANGE_BEYONDCIF = new HalfPel(512);
	class MotionVector {
		constructor(n1, n2) {
			this.n1 = n1;
			this.n2 = n2;
		}
		static zero() {
			return new MotionVector(HalfPel.zero(), HalfPel.zero());
		}
		median_of(mhs, rhs) {
			return new MotionVector(this.n1.median_of(mhs.n1, rhs.n1), this.n2.median_of(mhs.n2, rhs.n2));
		}
		into_lerp_parameters() {
			return [this.n1.into_lerp_parameters(), this.n2.into_lerp_parameters()];
		}
		add(rhs) {
			var g1 = asI16(this.n1.n + rhs.n1.n);
			var g2 = asI16(this.n2.n + rhs.n2.n);
			return new MotionVector(new HalfPel(g1), new HalfPel(g2));
		}
		average_sum_of_mvs() {
			return new MotionVector(this.n1.average_sum_of_mvs(), this.n2.average_sum_of_mvs());
		}
	}
	class IntraDc {
		constructor(n) {
			this.n = n;
		}
		static from_u8(value) {
			if (value == 0 || value == 128) {
				return null;
			} else {
				return new IntraDc(value);
			}
		}
		into_level() {
			if (this.n == 0xFF) {
				return 1024;
			} else {
				return asI16(asI16(asU16(this.n)) << 3);
			}
		}
	}
	class TCoefficient {
		constructor(is_short, run, level) {
			this.is_short = is_short;
			this.run = run;
			this.level = level;
		}
	}
	class Block {
		constructor(intradc, tcoef) {
			this.intradc = intradc;
			this.tcoef = tcoef;
		}
	}
	class VlcEntry {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	VlcEntry.End = 1;
	VlcEntry.Fork = 2;
	class MacroblockType {
		constructor(type) {
			this.type = type;
		}
		is_inter() {
			return this.type == MacroblockType.Inter || this.type == MacroblockType.InterQ || this.type == MacroblockType.Inter4V || this.type == MacroblockType.Inter4Vq;
		}
		is_intra() {
			return (this.type == MacroblockType.Intra) || (this.type == MacroblockType.IntraQ);
		}
		has_fourvec() {
			return this.type == MacroblockType.Inter4V || this.type == MacroblockType.Inter4Vq;
		}
		has_quantizer() {
			return this.type == MacroblockType.InterQ || this.type == MacroblockType.IntraQ || this.type == MacroblockType.Inter4Vq;
		}
	}
	MacroblockType.Inter = 1;
	MacroblockType.InterQ = 2;
	MacroblockType.Inter4V = 3;
	MacroblockType.Intra = 4;
	MacroblockType.IntraQ = 5;
	MacroblockType.Inter4Vq = 6;
	class Macroblock {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	Macroblock.Uncoded = 1;
	Macroblock.Stuffing = 2;
	Macroblock.Coded = 3;
	class BlockPatternEntry {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	BlockPatternEntry.Stuffing = 1;
	BlockPatternEntry.Invalid = 2;
	BlockPatternEntry.Valid = 3;
	const MCBPC_I_TABLE = [new VlcEntry(VlcEntry.Fork, [2, 1]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), false, false])), new VlcEntry(VlcEntry.Fork, [6, 3]), new VlcEntry(VlcEntry.Fork, [4, 5]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), true, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), true, true])), new VlcEntry(VlcEntry.Fork, [8, 7]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), false, true])), new VlcEntry(VlcEntry.Fork, [10, 9]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), false, false])), new VlcEntry(VlcEntry.Fork, [14, 11]), new VlcEntry(VlcEntry.Fork, [12, 13]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), true, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), true, true])), new VlcEntry(VlcEntry.Fork, [16, 20]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Invalid)), new VlcEntry(VlcEntry.Fork, [17, 15]), new VlcEntry(VlcEntry.Fork, [18, 15]), new VlcEntry(VlcEntry.Fork, [15, 19]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Stuffing)), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), false, true]))];
	const MCBPC_P_TABLE = [new VlcEntry(VlcEntry.Fork, [2, 1]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter), false, false])), new VlcEntry(VlcEntry.Fork, [6, 3]), new VlcEntry(VlcEntry.Fork, [4, 5]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4V), false, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.InterQ), false, false])), new VlcEntry(VlcEntry.Fork, [10, 7]), new VlcEntry(VlcEntry.Fork, [8, 9]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter), true, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter), false, true])), new VlcEntry(VlcEntry.Fork, [16, 11]), new VlcEntry(VlcEntry.Fork, [13, 12]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), false, false])), new VlcEntry(VlcEntry.Fork, [14, 15]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), false, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter), true, true])), new VlcEntry(VlcEntry.Fork, [24, 17]), new VlcEntry(VlcEntry.Fork, [18, 21]), new VlcEntry(VlcEntry.Fork, [19, 20]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4V), true, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4V), false, true])), new VlcEntry(VlcEntry.Fork, [22, 23]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.InterQ), true, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.InterQ), false, true])), new VlcEntry(VlcEntry.Fork, [30, 25]), new VlcEntry(VlcEntry.Fork, [27, 26]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), true, true])), new VlcEntry(VlcEntry.Fork, [28, 29]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), false, true])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4V), true, true])), new VlcEntry(VlcEntry.Fork, [36, 31]), new VlcEntry(VlcEntry.Fork, [33, 32]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Intra), true, false])), new VlcEntry(VlcEntry.Fork, [34, 35]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), false, true])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.InterQ), true, true])), new VlcEntry(VlcEntry.Fork, [40, 37]), new VlcEntry(VlcEntry.Fork, [38, 39]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), true, true])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.IntraQ), true, false])), new VlcEntry(VlcEntry.Fork, [42, 41]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Stuffing)), new VlcEntry(VlcEntry.Fork, [43, 44]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Invalid)), new VlcEntry(VlcEntry.Fork, [45, 46]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4Vq), false, false])), new VlcEntry(VlcEntry.Fork, [47, 50]), new VlcEntry(VlcEntry.Fork, [48, 49]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4Vq), false, true])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Invalid)), new VlcEntry(VlcEntry.Fork, [51, 52]), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4Vq), true, false])), new VlcEntry(VlcEntry.End, new BlockPatternEntry(BlockPatternEntry.Valid, [new MacroblockType(MacroblockType.Inter4Vq), true, true]))];
	const MODB_TABLE = [new VlcEntry(VlcEntry.Fork, [1, 2]), new VlcEntry(VlcEntry.End, [false, false]), new VlcEntry(VlcEntry.Fork, [3, 4]), new VlcEntry(VlcEntry.End, [false, true]), new VlcEntry(VlcEntry.End, [true, true])];
	function decode_cbpb(reader) {
		let cbp0 = reader.readBits(1) == 1;
		let cbp1 = reader.readBits(1) == 1;
		let cbp2 = reader.readBits(1) == 1;
		let cbp3 = reader.readBits(1) == 1;
		let cbp4 = reader.readBits(1) == 1;
		let cbp5 = reader.readBits(1) == 1;
		return new CodedBlockPattern([cbp0, cbp1, cbp2, cbp3], cbp4, cbp5);
	}
	const CBPY_TABLE_INTRA = [new VlcEntry(VlcEntry.Fork, [1, 24]), new VlcEntry(VlcEntry.Fork, [2, 17]), new VlcEntry(VlcEntry.Fork, [3, 12]), new VlcEntry(VlcEntry.Fork, [4, 9]), new VlcEntry(VlcEntry.Fork, [5, 6]), new VlcEntry(VlcEntry.End, null), new VlcEntry(VlcEntry.Fork, [7, 8]), new VlcEntry(VlcEntry.End, [false, true, true, false]), new VlcEntry(VlcEntry.End, [true, false, false, true]), new VlcEntry(VlcEntry.Fork, [10, 11]), new VlcEntry(VlcEntry.End, [true, false, false, false]), new VlcEntry(VlcEntry.End, [false, true, false, false]), new VlcEntry(VlcEntry.Fork, [13, 16]), new VlcEntry(VlcEntry.Fork, [14, 15]), new VlcEntry(VlcEntry.End, [false, false, true, false]), new VlcEntry(VlcEntry.End, [false, false, false, true]), new VlcEntry(VlcEntry.End, [false, false, false, false]), new VlcEntry(VlcEntry.Fork, [18, 21]), new VlcEntry(VlcEntry.Fork, [19, 20]), new VlcEntry(VlcEntry.End, [true, true, false, false]), new VlcEntry(VlcEntry.End, [true, false, true, false]), new VlcEntry(VlcEntry.Fork, [22, 23]), new VlcEntry(VlcEntry.End, [true, true, true, false]), new VlcEntry(VlcEntry.End, [false, true, false, true]), new VlcEntry(VlcEntry.Fork, [25, 32]), new VlcEntry(VlcEntry.Fork, [26, 29]), new VlcEntry(VlcEntry.Fork, [27, 28]), new VlcEntry(VlcEntry.End, [true, true, false, true]), new VlcEntry(VlcEntry.End, [false, false, true, true]), new VlcEntry(VlcEntry.Fork, [30, 31]), new VlcEntry(VlcEntry.End, [true, false, true, true]), new VlcEntry(VlcEntry.End, [false, true, true, true]), new VlcEntry(VlcEntry.End, [true, true, true, true])];
	function decode_dquant(reader) {
		switch(reader.readBits(2)) {
			case 0:
				return -1;
			case 1:
				return -2;
			case 2:
				return 1;
			case 3:
				return 2;
			default:
				throw new Error("InternalDecoderError");
		}
	}
	const MVD_TABLE = [new VlcEntry(VlcEntry.Fork, [2, 1]), new VlcEntry(VlcEntry.End, 0.0), new VlcEntry(VlcEntry.Fork, [6, 3]), new VlcEntry(VlcEntry.Fork, [4, 5]), new VlcEntry(VlcEntry.End, 0.5), new VlcEntry(VlcEntry.End, -0.5), new VlcEntry(VlcEntry.Fork, [10, 7]), new VlcEntry(VlcEntry.Fork, [8, 9]), new VlcEntry(VlcEntry.End, 1.0), new VlcEntry(VlcEntry.End, -1.0), new VlcEntry(VlcEntry.Fork, [14, 11]), new VlcEntry(VlcEntry.Fork, [12, 13]), new VlcEntry(VlcEntry.End, 1.5), new VlcEntry(VlcEntry.End, -1.5), new VlcEntry(VlcEntry.Fork, [26, 15]), new VlcEntry(VlcEntry.Fork, [19, 16]), new VlcEntry(VlcEntry.Fork, [17, 18]), new VlcEntry(VlcEntry.End, 2.0), new VlcEntry(VlcEntry.End, -2.0), new VlcEntry(VlcEntry.Fork, [23, 20]), new VlcEntry(VlcEntry.Fork, [21, 22]), new VlcEntry(VlcEntry.End, 2.5), new VlcEntry(VlcEntry.End, -2.5), new VlcEntry(VlcEntry.Fork, [24, 25]), new VlcEntry(VlcEntry.End, 3.0), new VlcEntry(VlcEntry.End, -3.0), new VlcEntry(VlcEntry.Fork, [50, 27]), new VlcEntry(VlcEntry.Fork, [31, 28]), new VlcEntry(VlcEntry.Fork, [29, 30]), new VlcEntry(VlcEntry.End, 3.5), new VlcEntry(VlcEntry.End, -3.5), new VlcEntry(VlcEntry.Fork, [39, 32]), new VlcEntry(VlcEntry.Fork, [36, 33]), new VlcEntry(VlcEntry.Fork, [34, 35]), new VlcEntry(VlcEntry.End, 4.0), new VlcEntry(VlcEntry.End, -4.0), new VlcEntry(VlcEntry.Fork, [37, 38]), new VlcEntry(VlcEntry.End, 4.5), new VlcEntry(VlcEntry.End, -4.5), new VlcEntry(VlcEntry.Fork, [43, 40]), new VlcEntry(VlcEntry.Fork, [41, 42]), new VlcEntry(VlcEntry.End, 5.0), new VlcEntry(VlcEntry.End, -5.0), new VlcEntry(VlcEntry.Fork, [47, 44]), new VlcEntry(VlcEntry.Fork, [45, 46]), new VlcEntry(VlcEntry.End, 5.5), new VlcEntry(VlcEntry.End, -5.5), new VlcEntry(VlcEntry.Fork, [48, 49]), new VlcEntry(VlcEntry.End, 6.0), new VlcEntry(VlcEntry.End, -6.0), new VlcEntry(VlcEntry.Fork, [82, 51]), new VlcEntry(VlcEntry.Fork, [67, 52]), new VlcEntry(VlcEntry.Fork, [60, 53]), new VlcEntry(VlcEntry.Fork, [57, 54]), new VlcEntry(VlcEntry.Fork, [55, 56]), new VlcEntry(VlcEntry.End, 6.5), new VlcEntry(VlcEntry.End, -6.5), new VlcEntry(VlcEntry.Fork, [58, 59]), new VlcEntry(VlcEntry.End, 7.0), new VlcEntry(VlcEntry.End, -7.0), new VlcEntry(VlcEntry.Fork, [64, 61]), new VlcEntry(VlcEntry.Fork, [62, 63]), new VlcEntry(VlcEntry.End, 7.5), new VlcEntry(VlcEntry.End, -7.5), new VlcEntry(VlcEntry.Fork, [65, 66]), new VlcEntry(VlcEntry.End, 8.0), new VlcEntry(VlcEntry.End, -8.0), new VlcEntry(VlcEntry.Fork, [75, 68]), new VlcEntry(VlcEntry.Fork, [72, 69]), new VlcEntry(VlcEntry.Fork, [70, 71]), new VlcEntry(VlcEntry.End, 8.5), new VlcEntry(VlcEntry.End, -8.5), new VlcEntry(VlcEntry.Fork, [73, 74]), new VlcEntry(VlcEntry.End, 9.0), new VlcEntry(VlcEntry.End, -9.0), new VlcEntry(VlcEntry.Fork, [79, 76]), new VlcEntry(VlcEntry.Fork, [77, 78]), new VlcEntry(VlcEntry.End, 9.5), new VlcEntry(VlcEntry.End, -9.5), new VlcEntry(VlcEntry.Fork, [80, 81]), new VlcEntry(VlcEntry.End, 10.0), new VlcEntry(VlcEntry.End, -10.0), new VlcEntry(VlcEntry.Fork, [98, 83]), new VlcEntry(VlcEntry.Fork, [91, 84]), new VlcEntry(VlcEntry.Fork, [88, 85]), new VlcEntry(VlcEntry.Fork, [86, 87]), new VlcEntry(VlcEntry.End, 10.5), new VlcEntry(VlcEntry.End, -10.5), new VlcEntry(VlcEntry.Fork, [89, 90]), new VlcEntry(VlcEntry.End, 11.0), new VlcEntry(VlcEntry.End, -11.0), new VlcEntry(VlcEntry.Fork, [95, 92]), new VlcEntry(VlcEntry.Fork, [93, 94]), new VlcEntry(VlcEntry.End, 11.5), new VlcEntry(VlcEntry.End, -11.5), new VlcEntry(VlcEntry.Fork, [96, 97]), new VlcEntry(VlcEntry.End, 12.0), new VlcEntry(VlcEntry.End, -12.0), new VlcEntry(VlcEntry.Fork, [114, 99]), new VlcEntry(VlcEntry.Fork, [107, 100]), new VlcEntry(VlcEntry.Fork, [104, 101]), new VlcEntry(VlcEntry.Fork, [102, 103]), new VlcEntry(VlcEntry.End, 12.5), new VlcEntry(VlcEntry.End, -12.5), new VlcEntry(VlcEntry.Fork, [105, 106]), new VlcEntry(VlcEntry.End, 13.0), new VlcEntry(VlcEntry.End, -13.0), new VlcEntry(VlcEntry.Fork, [111, 108]), new VlcEntry(VlcEntry.Fork, [109, 110]), new VlcEntry(VlcEntry.End, 13.5), new VlcEntry(VlcEntry.End, -13.5), new VlcEntry(VlcEntry.Fork, [112, 113]), new VlcEntry(VlcEntry.End, 14.0), new VlcEntry(VlcEntry.End, -14.0), new VlcEntry(VlcEntry.Fork, [122, 115]), new VlcEntry(VlcEntry.Fork, [119, 116]), new VlcEntry(VlcEntry.Fork, [117, 118]), new VlcEntry(VlcEntry.End, 14.5), new VlcEntry(VlcEntry.End, -14.5), new VlcEntry(VlcEntry.Fork, [120, 121]), new VlcEntry(VlcEntry.End, 15.0), new VlcEntry(VlcEntry.End, -15.0), new VlcEntry(VlcEntry.Fork, [129, 123]), new VlcEntry(VlcEntry.Fork, [127, 124]), new VlcEntry(VlcEntry.Fork, [125, 126]), new VlcEntry(VlcEntry.End, 15.5), new VlcEntry(VlcEntry.End, -15.5), new VlcEntry(VlcEntry.Fork, [129, 128]), new VlcEntry(VlcEntry.End, -16.0), new VlcEntry(VlcEntry.End, null)];
	function decode_motion_vector(reader, picture, running_options) {
		if (running_options.UNRESTRICTED_MOTION_VECTORS && picture.has_plusptype) {
			let x = reader.read_umv();
			let y = reader.read_umv();
			return new MotionVector(x, y);
		} else {
			var res_x = reader.readVLC(MVD_TABLE);
			var res_Y = reader.readVLC(MVD_TABLE);
			if (res_x === null || res_Y === null) {
				throw new Error("InvalidMvd");
			}
			let x = HalfPel.from(res_x);
			let y = HalfPel.from(res_Y);
			return new MotionVector(x, y);
		}
	}
	function decode_macroblock(reader, picture, running_options) {
		return reader.withTransaction(function(reader) {
			let is_coded = 0;
			if (picture.picture_type.type == PictureTypeCode.IFrame) {
				is_coded = 0;
			} else {
				is_coded = reader.readBits(1);
			}
			if (is_coded == 0) {
				var mcbpc = null;
				var picture_type = picture.picture_type;
				switch(picture_type.type) {
					case PictureTypeCode.IFrame:
						mcbpc = reader.readVLC(MCBPC_I_TABLE);
						break;
					case PictureTypeCode.PFrame:
						mcbpc = reader.readVLC(MCBPC_P_TABLE);
						break;
					default:
						throw new Error("UnimplementedDecoding");
				}
				var mb_type = null;
				var codes_chroma_b = null;
				var codes_chroma_r = null;
				switch(mcbpc.type) {
					case BlockPatternEntry.Stuffing:
						return new Macroblock(Macroblock.Stuffing);
					case BlockPatternEntry.Invalid:
						throw new Error("InvalidMacroblockHeader");
					case BlockPatternEntry.Valid:
						mb_type = mcbpc.value[0];
						codes_chroma_b = mcbpc.value[1];
						codes_chroma_r = mcbpc.value[2];
						break;
				}
				var has_cbpb = null;
				var has_mvdb = null;
				if (picture_type.type == PictureTypeCode.PbFrame) {
					var ergf = reader.readVLC(MODB_TABLE);
					has_cbpb = ergf[0];
					has_mvdb = ergf[1];
				} else {
					has_cbpb = false;
					has_mvdb = false;
				}
				let codes_luma = null;
				if (mb_type.is_intra()) {
					var dfgs = reader.readVLC(CBPY_TABLE_INTRA);
					if (dfgs === null) throw new Error("InvalidMacroblockCodedBits");
					codes_luma = dfgs;
				} else {
					var dfgs = reader.readVLC(CBPY_TABLE_INTRA);;
					if (dfgs === null) throw new Error("InvalidMacroblockCodedBits");
					codes_luma = [!dfgs[0], !dfgs[1], !dfgs[2], !dfgs[3]];
				}
				let coded_block_pattern_b = null;
				if (has_cbpb) {
					coded_block_pattern_b = decode_cbpb(reader);
				}
				let d_quantizer = null;
				if (running_options.MODIFIED_QUANTIZATION) {
					throw new Error("UnimplementedDecoding");
				} else if (mb_type.has_quantizer()) {
					d_quantizer = decode_dquant(reader);
				}
				let motion_vector = null;
				if (mb_type.is_inter() || picture_type.is_any_pbframe()) {
					motion_vector = decode_motion_vector(reader, picture, running_options);
				}
				let addl_motion_vectors = null;
				if (mb_type.has_fourvec()) {
					let mv2 = decode_motion_vector(reader, picture, running_options);
					let mv3 = decode_motion_vector(reader, picture, running_options);
					let mv4 = decode_motion_vector(reader, picture, running_options);
					addl_motion_vectors = [mv2, mv3, mv4];
				}
				let motion_vectors_b = null;
				if (has_mvdb) {
					let mv1 = decode_motion_vector(reader, picture, running_options);
					let mv2 = decode_motion_vector(reader, picture, running_options);
					let mv3 = decode_motion_vector(reader, picture, running_options);
					let mv4 = decode_motion_vector(reader, picture, running_options);
					motion_vectors_b = [mv1, mv2, mv3, mv4];
				}
				return new Macroblock(Macroblock.Coded, {
					mb_type,
					coded_block_pattern: {
						codes_luma,
						codes_chroma_b,
						codes_chroma_r
					},
					coded_block_pattern_b,
					d_quantizer,
					motion_vector,
					addl_motion_vectors,
					motion_vectors_b,
				});
			} else {
				return new Macroblock(Macroblock.Uncoded);
			}
		});
	}
	class ShortTCoefficient {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	ShortTCoefficient.EscapeToLong = 1;
	ShortTCoefficient.Run = 2;
	const TCOEF_TABLE = [new VlcEntry(VlcEntry.Fork, [8, 1]),new VlcEntry(VlcEntry.Fork, [2, 3]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 1})),new VlcEntry(VlcEntry.Fork, [4, 5]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 1,level: 1})),new VlcEntry(VlcEntry.Fork, [6, 7]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 2,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 2})),new VlcEntry(VlcEntry.Fork, [28, 9]),new VlcEntry(VlcEntry.Fork, [15, 10]),new VlcEntry(VlcEntry.Fork, [12, 11]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 0,level: 1})),new VlcEntry(VlcEntry.Fork, [13, 14]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 4,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 3,level: 1})),new VlcEntry(VlcEntry.Fork, [16, 23]),new VlcEntry(VlcEntry.Fork, [17, 20]),new VlcEntry(VlcEntry.Fork, [18, 19]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 9,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 8,level: 1})),new VlcEntry(VlcEntry.Fork, [21, 22]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 7,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 6,level: 1})),new VlcEntry(VlcEntry.Fork, [25, 24]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 5,level: 1})),new VlcEntry(VlcEntry.Fork, [26, 27]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 1,level: 2})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 3})),new VlcEntry(VlcEntry.Fork, [52, 29]),new VlcEntry(VlcEntry.Fork, [37, 30]),new VlcEntry(VlcEntry.Fork, [31, 34]),new VlcEntry(VlcEntry.Fork, [32, 33]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 4,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 3,level: 1})),new VlcEntry(VlcEntry.Fork, [35, 36]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 2,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 1,level: 1})),new VlcEntry(VlcEntry.Fork, [38, 45]),new VlcEntry(VlcEntry.Fork, [39, 42]),new VlcEntry(VlcEntry.Fork, [40, 41]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 8,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 7,level: 1})),new VlcEntry(VlcEntry.Fork, [43, 44]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 6,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 5,level: 1})),new VlcEntry(VlcEntry.Fork, [46, 49]),new VlcEntry(VlcEntry.Fork, [47, 48]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 12,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 11,level: 1})),new VlcEntry(VlcEntry.Fork, [50, 51]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 10,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 4})),new VlcEntry(VlcEntry.Fork, [90, 53]),new VlcEntry(VlcEntry.Fork, [69, 54]),new VlcEntry(VlcEntry.Fork, [55, 62]),new VlcEntry(VlcEntry.Fork, [56, 59]),new VlcEntry(VlcEntry.Fork, [57, 58]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 11,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 10,level: 1})),new VlcEntry(VlcEntry.Fork, [60, 61]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 9,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 14,level: 1})),new VlcEntry(VlcEntry.Fork, [63, 66]),new VlcEntry(VlcEntry.Fork, [64, 65]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 13,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 2,level: 2})),new VlcEntry(VlcEntry.Fork, [67, 68]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 1,level: 3})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 5})),new VlcEntry(VlcEntry.Fork, [77, 70]),new VlcEntry(VlcEntry.Fork, [71, 74]),new VlcEntry(VlcEntry.Fork, [72, 73]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 15,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 14,level: 1})),new VlcEntry(VlcEntry.Fork, [75, 76]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 13,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 12,level: 1})),new VlcEntry(VlcEntry.Fork, [78, 85]),new VlcEntry(VlcEntry.Fork, [79, 82]),new VlcEntry(VlcEntry.Fork, [80, 81]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 16,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 15,level: 1})),new VlcEntry(VlcEntry.Fork, [83, 84]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 4,level: 2})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 3,level: 2})),new VlcEntry(VlcEntry.Fork, [86, 89]),new VlcEntry(VlcEntry.Fork, [87, 88]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 7})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 6})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 16,level: 1})),new VlcEntry(VlcEntry.Fork, [124, 91]),new VlcEntry(VlcEntry.Fork, [92, 109]),new VlcEntry(VlcEntry.Fork, [93, 102]),new VlcEntry(VlcEntry.Fork, [94, 99]),new VlcEntry(VlcEntry.Fork, [95, 98]),new VlcEntry(VlcEntry.Fork, [96, 97]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 9})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 8})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 24,level: 1})),new VlcEntry(VlcEntry.Fork, [100, 101]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 23,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 22,level: 1})),new VlcEntry(VlcEntry.Fork, [103, 106]),new VlcEntry(VlcEntry.Fork, [104, 105]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 21,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 20,level: 1})),new VlcEntry(VlcEntry.Fork, [107, 108]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 19,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 18,level: 1})),new VlcEntry(VlcEntry.Fork, [110, 117]),new VlcEntry(VlcEntry.Fork, [111, 114]),new VlcEntry(VlcEntry.Fork, [112, 113]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 17,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 0,level: 2})),new VlcEntry(VlcEntry.Fork, [115, 116]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 22,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 21,level: 1})),new VlcEntry(VlcEntry.Fork, [118, 121]),new VlcEntry(VlcEntry.Fork, [119, 120]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 20,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 19,level: 1})),new VlcEntry(VlcEntry.Fork, [122, 123]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 18,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 17,level: 1})),new VlcEntry(VlcEntry.Fork, [174, 125]),new VlcEntry(VlcEntry.Fork, [127, 126]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.EscapeToLong)),new VlcEntry(VlcEntry.Fork, [128, 143]),new VlcEntry(VlcEntry.Fork, [129, 136]),new VlcEntry(VlcEntry.Fork, [130, 133]),new VlcEntry(VlcEntry.Fork, [131, 132]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 12})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 1,level: 5})),new VlcEntry(VlcEntry.Fork, [134, 135]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 23,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 24,level: 1})),new VlcEntry(VlcEntry.Fork, [137, 140]),new VlcEntry(VlcEntry.Fork, [138, 139]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 29,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 30,level: 1})),new VlcEntry(VlcEntry.Fork, [141, 142]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 31,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 32,level: 1})),new VlcEntry(VlcEntry.Fork, [144, 159]),new VlcEntry(VlcEntry.Fork, [145, 152]),new VlcEntry(VlcEntry.Fork, [146, 149]),new VlcEntry(VlcEntry.Fork, [147, 148]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 1,level: 6})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 2,level: 4})),new VlcEntry(VlcEntry.Fork, [150, 151]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 4,level: 3})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 5,level: 3})),new VlcEntry(VlcEntry.Fork, [153, 156]),new VlcEntry(VlcEntry.Fork, [154, 155]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 6,level: 3})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 10,level: 2})),new VlcEntry(VlcEntry.Fork, [157, 158]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 25,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 26,level: 1})),new VlcEntry(VlcEntry.Fork, [160, 167]),new VlcEntry(VlcEntry.Fork, [161, 164]),new VlcEntry(VlcEntry.Fork, [162, 163]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 33,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 34,level: 1})),new VlcEntry(VlcEntry.Fork, [165, 166]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 35,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 36,level: 1})),new VlcEntry(VlcEntry.Fork, [168, 171]),new VlcEntry(VlcEntry.Fork, [169, 170]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 37,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 38,level: 1})),new VlcEntry(VlcEntry.Fork, [172, 173]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 39,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 40,level: 1})),new VlcEntry(VlcEntry.Fork, [190, 175]),new VlcEntry(VlcEntry.Fork, [176, 183]),new VlcEntry(VlcEntry.Fork, [177, 180]),new VlcEntry(VlcEntry.Fork, [178, 179]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 9,level: 2})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 8,level: 2})),new VlcEntry(VlcEntry.Fork, [181, 182]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 7,level: 2})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 6,level: 2})),new VlcEntry(VlcEntry.Fork, [184, 187]),new VlcEntry(VlcEntry.Fork, [185, 186]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 5,level: 2})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 3,level: 3})),new VlcEntry(VlcEntry.Fork, [188, 189]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 2,level: 3})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 1,level: 4})),new VlcEntry(VlcEntry.Fork, [198, 191]),new VlcEntry(VlcEntry.Fork, [192, 195]),new VlcEntry(VlcEntry.Fork, [193, 194]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 28,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 27,level: 1})),new VlcEntry(VlcEntry.Fork, [196, 197]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 26,level: 1})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 25,level: 1})),new VlcEntry(VlcEntry.Fork, [206, 199]),new VlcEntry(VlcEntry.Fork, [200, 203]),new VlcEntry(VlcEntry.Fork, [201, 202]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 1,level: 2})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: true,run: 0,level: 3})),new VlcEntry(VlcEntry.Fork, [204, 205]),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 11})),new VlcEntry(VlcEntry.End, new ShortTCoefficient(ShortTCoefficient.Run, {last: false,run: 0,level: 10})),new VlcEntry(VlcEntry.End, null)];
	function decode_block(reader, decoder_options, picture, running_options, macroblock_type, tcoef_present) {
		return reader.withTransaction(function(reader) {
			let intradc = null;
			if (macroblock_type.is_intra()) {
				intradc = IntraDc.from_u8(reader.readUint8());
				if (intradc === null) 
					throw new Error("InvalidIntraDc");
			}
			var tcoef = [];
			while(tcoef_present) {
				let short_tcoef = reader.readVLC(TCOEF_TABLE);
				if (short_tcoef === null) 
					throw new Error("InvalidShortCoefficient");
				switch(short_tcoef.type) {
					case ShortTCoefficient.EscapeToLong:
						let level_width = null;
						if (decoder_options.sorensonSpark && (picture.version == 1)) {
							if (reader.readBits(1) == 1) {
								level_width = 11;
							} else {
								level_width = 7;
							}
						} else {
							level_width = 8;
						}
						let last = reader.readBits(1) == 1;
						let run = reader.readBits(6);
						let level = reader.readSignedBits(level_width);
						if (level == 0) {
							throw new Error("InvalidLongCoefficient");
						}
						tcoef.push(new TCoefficient(false, run, level));
						tcoef_present = !last;
						break;
					case ShortTCoefficient.Run:
						var res = short_tcoef.value;
						let sign = reader.readBits(1);
						if (sign == 0) {
							tcoef.push(new TCoefficient(true, res.run, res.level));
						} else {
							tcoef.push(new TCoefficient(true, res.run, -res.level));
						}
						tcoef_present = !res.last;
						break;
				}  
			}
			return new Block(intradc, tcoef);
		});
	}
	const DEZIGZAG_MAPPING = [[0, 0], [1, 0], [0, 1], [0, 2], [1, 1], [2, 0], [3, 0], [2, 1], [1, 2], [0, 3], [0, 4], [1, 3], [2, 2], [3, 1], [4, 0], [5, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5], [0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1], [6, 0], [7, 0], [6, 1], [5, 2], [4, 3], [3, 4], [2, 5], [1, 6], [0, 7], [1, 7], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1], [7, 2], [6, 3], [5, 4], [4, 5], [3, 6], [2, 7], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [7, 4], [6, 5], [5, 6], [4, 7], [5, 7], [6, 6], [7, 5], [7, 6], [6, 7], [7, 7]]
	function inverse_rle(encoded_block, levels, pos, blk_per_line, quant) {
		let block_id = ((pos[0] / 8) | 0) + (((pos[1] / 8) | 0) * blk_per_line);
		if (encoded_block.tcoef.length == 0) {
			if (encoded_block.intradc) {
				let dc_level = encoded_block.intradc.into_level();
				if (dc_level == 0) {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Zero);
				} else {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Dc, dc_level);
				}
			} else {
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Zero);
			}
		} else {
			var block_data = [new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8)];
			let is_horiz = true;
			let is_vert = true;
			let zigzag_index = 0;
			if (encoded_block.intradc) {
				block_data[0][0] = encoded_block.intradc.into_level();
				zigzag_index += 1;
			}
			for (var i = 0; i < encoded_block.tcoef.length; i++) {
				var tcoef = encoded_block.tcoef[i];
				zigzag_index += tcoef.run;
				if (zigzag_index >= DEZIGZAG_MAPPING.length) return;
				let [zig_x, zig_y] = DEZIGZAG_MAPPING[zigzag_index];
				let dequantized_level = asI16(quant) * ((2 * Math.abs(tcoef.level)) + 1);
				let parity = null;
				if (quant % 2 == 1) {
					parity = 0;
				} else {
					parity = -1;
				}
				let val = Math.max(Math.min(num_signum(tcoef.level) * (dequantized_level + parity), 2047), -2048);
				block_data[zig_y][zig_x] = val;
				zigzag_index += 1;
				if (val != 0.0) {
					if (zig_y > 0) {
						is_horiz = false;
					}
					if (zig_x > 0) {
						is_vert = false;
					}
				}
			}
			if ((is_horiz == true) && (is_vert == true)) {
				if (block_data[0][0] == 0) {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Zero);
				} else {
					levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Dc, block_data[0][0]);
				}
			} else if ((is_horiz == true) && (is_vert == false)) {
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Horiz, block_data[0]);
			} else if ((is_horiz == false) && (is_vert == true)) {
				var r = new Float32Array(8);
				r[0] = block_data[0][0];
				r[1] = block_data[1][0];
				r[2] = block_data[2][0];
				r[3] = block_data[3][0];
				r[4] = block_data[4][0];
				r[5] = block_data[5][0];
				r[6] = block_data[6][0];
				r[7] = block_data[7][0];
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Vert, r);
			} else if ((is_horiz == false) && (is_vert == false)) {
				levels[block_id] = new DecodedDctBlock(DecodedDctBlock.Full, block_data);
			}
		}
	}
	function read_sample(pixel_array, samples_per_row, num_rows, pos) {
		let [x, y] = pos;
		let _x = num_clamp(x, 0, samples_per_row - 1);
		let _y = num_clamp(y, 0, num_rows - 1);
		return pixel_array[_x + (_y * samples_per_row)];
	}
	function lerp(sample_a, sample_b, middle) {
		if (middle) {
			return asU8((sample_a + sample_b + 1) / 2);
		} else {
			return asU8(sample_a);
		}
	}
	function gather_block(pixel_array, samples_per_row, pos, mv, target) {
		var g = mv.into_lerp_parameters();
		let [x_delta, x_interp] = g[0];
		let [y_delta, y_interp] = g[1];
		let src_x = (pos[0] + x_delta) | 0;
		let src_y = (pos[1] + y_delta) | 0;
		let array_height = (pixel_array.length / samples_per_row) | 0;
		let block_cols = num_clamp((samples_per_row - pos[0]), 0, 8);
		let block_rows = num_clamp((array_height - pos[1]), 0, 8);
		if (!x_interp && !y_interp) {
			if (block_cols == 8 && block_rows == 8 && asfgdgdfg(src_x, 0, samples_per_row - 8) && asfgdgdfg(src_y, 0, array_height - 8)) {
				for (var j = 0; j < 8; j++) {
					let src_offset = src_x + ((src_y + j) * samples_per_row);
					let dest_offset = pos[0] + (pos[1] + j) * samples_per_row;
					for (var _ = 0; _ < 8; _++) {
						target[dest_offset + _] = pixel_array[src_offset + _];
					}
				}
			} else {
				for (var _j = 0; _j < block_rows; _j += 1) {
					var j = _j;
					var v = _j + src_y;
					for (var _i = 0; _i < block_cols; _i += 1) {
						var i = _i;
						var u = _i + src_x;
						target[pos[0] + i + ((pos[1] + j) * samples_per_row)] = read_sample(pixel_array, samples_per_row, array_height, [u, v]);
					}
				}
			}
		} else {
			for (var _j = 0; _j < block_rows; _j += 1) {
				var j = _j;
				var v = _j + src_y;
				for (var _i = 0; _i < block_cols; _i += 1) {
					var i = _i;
					var u = _i + src_x;
					let sample_0_0 = read_sample(pixel_array, samples_per_row, array_height, [u, v]);
					let sample_1_0 = read_sample(pixel_array, samples_per_row, array_height, [u + 1, v]);
					let sample_0_1 = read_sample(pixel_array, samples_per_row, array_height, [u, v + 1]);
					let sample_1_1 = read_sample(pixel_array, samples_per_row, array_height, [u + 1, v + 1]);
					if (x_interp && y_interp) {
						let sample = asU8((sample_0_0 + sample_1_0 + sample_0_1 + sample_1_1 + 2) / 4);
						target[pos[0] + i + ((pos[1] + j) * samples_per_row)] = sample;
					} else {
						let sample_mid_0 = lerp(sample_0_0, sample_1_0, x_interp);
						let sample_mid_1 = lerp(sample_0_1, sample_1_1, x_interp);
						target[pos[0] + i + ((pos[1] + j) * samples_per_row)] = lerp(sample_mid_0, sample_mid_1, y_interp);
					}
				}
			}
		}
	}
	function gather(mb_types, reference_picture, mvs, mb_per_line, new_picture) {
		for (var i = 0; i < mb_types.length; i++) {
			var mb_type = mb_types[i];
			var mv = mvs[i];
			if (mb_type.is_inter()) {
				if (!reference_picture)
					throw new Error("UncodedIFrameBlocks");
				let luma_samples_per_row = reference_picture.luma_samples_per_row();
				let pos = [
					Math.floor(i % mb_per_line) * 16,
					Math.floor(i / mb_per_line) * 16
				];
				gather_block(reference_picture.as_luma(), luma_samples_per_row, pos, mv[0], new_picture.as_luma_mut());
				gather_block(reference_picture.as_luma(), luma_samples_per_row, [pos[0] + 8, pos[1]], mv[1], new_picture.as_luma_mut());
				gather_block(reference_picture.as_luma(), luma_samples_per_row, [pos[0], pos[1] + 8], mv[2], new_picture.as_luma_mut());
				gather_block(reference_picture.as_luma(), luma_samples_per_row, [pos[0] + 8, pos[1] + 8], mv[3], new_picture.as_luma_mut());
				let mv_chr = mv[0].add(mv[1].add(mv[2].add(mv[3]))).average_sum_of_mvs();
				let chroma_samples_per_row = reference_picture.chroma_samples_per_row;
				let chroma_pos = [Math.floor(i % mb_per_line) * 8, Math.floor(i / mb_per_line) * 8];
				gather_block(reference_picture.as_chroma_b(), chroma_samples_per_row, [chroma_pos[0], chroma_pos[1]], mv_chr, new_picture.as_chroma_b_mut());
				gather_block(reference_picture.as_chroma_r(), chroma_samples_per_row, [chroma_pos[0], chroma_pos[1]], mv_chr, new_picture.as_chroma_r_mut());
			}
		}
	}
	const BASIS_TABLE = [new Float32Array([0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677, 0.70710677]), new Float32Array([0.98078525, 0.8314696, 0.5555702, 0.19509023, -0.19509032, -0.55557036, -0.83146966, -0.9807853]), new Float32Array([0.9238795, 0.38268343, -0.38268352, -0.9238796, -0.9238795, -0.38268313, 0.3826836, 0.92387956]), new Float32Array([0.8314696, -0.19509032, -0.9807853, -0.55557, 0.55557007, 0.98078525, 0.19509007, -0.8314698]), new Float32Array([0.70710677, -0.70710677, -0.70710665, 0.707107, 0.70710677, -0.70710725, -0.70710653,  0.7071068]), new Float32Array([0.5555702, -0.9807853, 0.19509041, 0.83146936, -0.8314698, -0.19508928, 0.9807853, -0.55557007]), new Float32Array([0.38268343, -0.9238795, 0.92387974, -0.3826839, -0.38268384, 0.9238793, -0.92387974,  0.3826839]), new Float32Array([0.19509023, -0.55557, 0.83146936, -0.9807852, 0.98078525, -0.83147013, 0.55557114, -0.19508967])];
	function idct_1d(input, output) {
		output.fill(0);
		for (var i = 0; i < output.length; i++) {
			for (var freq = 0; freq < 8; freq++) {
				output[i] += input[freq] * BASIS_TABLE[freq][i];
			}
		}
	}
	function idct_channel(block_levels, output, blk_per_line, output_samples_per_line) {
		let output_height = (output.length / output_samples_per_line) | 0;
		let blk_height = (block_levels.length / blk_per_line) | 0;
		let idct_intermediate = [new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8)];
		let idct_output = [new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8), new Float32Array(8)];
		for (var y_base = 0; y_base < blk_height; y_base++) {
			for (var x_base = 0; x_base < blk_per_line; x_base++) {
				let block_id = x_base + (y_base * blk_per_line);
				if (block_id >= block_levels.length) 
					continue;
				let xs = num_clamp((output_samples_per_line - x_base * 8), 0, 8);
				let ys = num_clamp((output_height - y_base * 8), 0, 8);
				var b = block_levels[block_id];
				switch(b.type) {
					case DecodedDctBlock.Zero:
						break;
					case DecodedDctBlock.Dc:
						var dc = b.value;
						let clipped_idct = num_clamp(asI16((dc * 0.5 / 4.0 + num_signum(dc) * 0.5)), -256, 255);
						for (var y_offset = 0; y_offset < ys; y_offset++) {
							for (var x_offset = 0; x_offset < xs; x_offset++) {
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp(clipped_idct + mocomp_pixel, 0, 255));
							}
						}
						break;
					case DecodedDctBlock.Horiz:
						var first_row = b.value;
						idct_1d(first_row, idct_intermediate[0]);
						for (var y_offset = 0; y_offset < ys; y_offset++) {
							var _idcts = idct_intermediate[0];
							for (var x_offset = 0; x_offset < xs; x_offset++) {
								var idct = _idcts[x_offset];
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let clipped_idct = num_clamp((asI16(idct * BASIS_TABLE[0][0] / 4.0 + num_signum(idct) * 0.5)), -256, 255);
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp((clipped_idct + mocomp_pixel), 0, 255));
							}
						}
						break;
					case DecodedDctBlock.Vert:
						var first_col = b.value;
						idct_1d(first_col, idct_intermediate[0]);
						var _idcts = idct_intermediate[0];
						for (var y_offset = 0; y_offset < ys; y_offset++) {
							var idct = _idcts[y_offset];
							for (var x_offset = 0; x_offset < xs; x_offset++) {
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let clipped_idct = num_clamp((asI16(idct * BASIS_TABLE[0][0] / 4.0 + num_signum(idct) * 0.5)), -256, 255);
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp((clipped_idct + mocomp_pixel), 0, 255));
							}
						}
						break;
					case DecodedDctBlock.Full:
						var block_data = b.value;
						for (var row = 0; row < 8; row++) {
							idct_1d(block_data[row], idct_output[row]);
							for (var i = 0; i < idct_intermediate.length; i++) {
								idct_intermediate[i][row] = idct_output[row][i];
							}
						}
						for (var row = 0; row < 8; row++) {
							idct_1d(idct_intermediate[row], idct_output[row]);
						}
						for (var x_offset = 0; x_offset < xs; x_offset++) {
							var idct_row = idct_output[x_offset];
							for (var y_offset = 0; y_offset < ys; y_offset++) {
								var idct = idct_row[y_offset];
								let x = x_base * 8 + x_offset;
								let y = y_base * 8 + y_offset;
								let clipped_idct = num_clamp((asI16(idct / 4.0 + num_signum(idct) * 0.5)), -256, 255);
								let mocomp_pixel = asI16(output[x + (y * output_samples_per_line)]);
								output[x + (y * output_samples_per_line)] = asU8(num_clamp((clipped_idct + mocomp_pixel), 0, 255));
							}
						}
						break;
				}
			}
		}
	}
	function predict_candidate(predictor_vectors, current_predictors, mb_per_line, index) {
		let current_mb = predictor_vectors.length;
		let col_index = current_mb % mb_per_line;
		let mv1_pred = null;
		switch(index) {
			case 0:
			case 2:
				if (col_index == 0) {
					mv1_pred = MotionVector.zero();
				} else {
					mv1_pred = predictor_vectors[current_mb - 1][index + 1];
				}
				break;
			case 1:
			case 3:
				mv1_pred = current_predictors[index - 1];
				break;
			default:
				throw new Error("unreachable");
		}
		let line_index = (current_mb / mb_per_line) | 0;
		let last_line_mb = (saturatingSub(line_index, 1) * mb_per_line) + col_index;
		let mv2_pred = null;
		switch(index) {
			case 0:
			case 1:
				if (line_index == 0) {
					mv2_pred = mv1_pred;
				} else {
					var r = predictor_vectors[last_line_mb];
					if (r) {
						mv2_pred = r[index + 2];
					} else {
						mv2_pred = mv1_pred;
					}
				}
				break;
			case 2:
			case 3:
				mv2_pred = current_predictors[0];
				break;
			default:
				throw new Error("unreachable");
		}
		let is_end_of_line = col_index == saturatingSub(mb_per_line, 1);
		let mv3_pred = null;
		switch(index) {
			case 0:
			case 1:
				if (is_end_of_line) {
					mv3_pred = MotionVector.zero();
				} else {
					if (line_index == 0) {
						mv3_pred = mv1_pred;
					} else {
						var r = predictor_vectors[last_line_mb + 1];
						if (r) {
							mv3_pred = r[2];
						} else {
							mv3_pred = mv1_pred;
						}
					}
				}
				break;
			case 2:
			case 3:
				mv3_pred = current_predictors[1];
				break;
			default:
				throw new Error("unreachable");
		}
		return mv1_pred.median_of(mv2_pred, mv3_pred);
	}
	function halfpel_decode(current_picture, running_options, predictor, mvd, is_x) {
		let range = HalfPel.STANDARD_RANGE;
		let out = new HalfPel(asI16(mvd.n + predictor.n));
		if (!out.is_mv_within_range(range)) {
			out = new HalfPel(asI16(mvd.invert().n + predictor.n));
		}
		return out;
	}
	function mv_decode(current_picture, running_options, predictor, mvd) {
		let mvx = mvd.n1;
		let mvy = mvd.n2;
		let cpx = predictor.n1;
		let cpy = predictor.n2;
		let out_x = halfpel_decode(current_picture, running_options, cpx, mvx, true);
		let out_y = halfpel_decode(current_picture, running_options, cpy, mvy, false);
		return new MotionVector(out_x, out_y);
	}
	class H263State {
		constructor(decoderOptions) {
			this.decoderOptions = decoderOptions;
			this.last_picture = null;
			this.reference_picture = null;
			this.running_options = PictureOption.empty();
			this.reference_states = new Map();
		}
		isSorenson() {
			return this.decoderOptions.sorensonSpark;
		}
		getLastPicture() {
			if (this.last_picture === null) {
				return null;
			} else {
				return this.reference_states.get(this.last_picture);
			}
		}
		getReferencePicture() {
			if (this.reference_picture === null) {
				return null;
			} else {
				return this.reference_states.get(this.reference_picture);
			}
		}
		cleanup_buffers() {
			var r1 = this.last_picture;
			let last_picture = this.reference_states.get(r1);
			this.reference_states = new Map();
			if (last_picture) {
				this.reference_states.set(r1, last_picture);
			}
		}
		parsePicture(reader, previous_picture) {
			return decodePicture(reader, this.decoderOptions, previous_picture);
		}
		decodeNextPicture(reader) {
			let next_picture = this.parsePicture(reader, this.getLastPicture());
			var next_running_options = next_picture.options;
			let format = null;
			if (next_picture.format) {
				format = next_picture.format;
			} else if (next_picture.picture_type.type == PictureTypeCode.IFrame) {
				throw new Error("PictureFormatMissing");
			} else {
				var ref_format = null;
				var rfgh = this.getLastPicture();
				if (rfgh !== null) {
					ref_format = rfgh.format;
				} else {
					throw new Error("PictureFormatMissing");
				}
				format = ref_format;
			}
			let reference_picture = this.getReferencePicture();
			let output_dimensions = format.intoWidthAndHeight();
			let mb_per_line = Math.ceil(output_dimensions[0] / 16.0);
			let mb_height = Math.ceil(output_dimensions[1] / 16.0);
			let level_dimensions = [mb_per_line * 16, mb_height * 16];
			let in_force_quantizer = next_picture.quantizer;
			var MAX_L = mb_per_line * mb_height;
			let predictor_vectors = [];
			let macroblock_types = [];
			let next_decoded_picture = new DecodedPicture(next_picture, format);
			var luma_levels = new Array(level_dimensions[0] * level_dimensions[1] / 64);
			var chroma_b_levels = new Array(level_dimensions[0] * level_dimensions[1] / 4 / 64);
			var chroma_r_levels = new Array(level_dimensions[0] * level_dimensions[1] / 4 / 64);
			for (var i = 0; i < luma_levels.length; i++) luma_levels[i] = new DecodedDctBlock(DecodedDctBlock.Zero);
			for (var i = 0; i < chroma_b_levels.length; i++) chroma_b_levels[i] = new DecodedDctBlock(DecodedDctBlock.Zero);
			for (var i = 0; i < chroma_r_levels.length; i++) chroma_r_levels[i] = new DecodedDctBlock(DecodedDctBlock.Zero);
			while (macroblock_types.length < MAX_L) {
				let mb;
				try {
					mb = decode_macroblock(reader, next_decoded_picture.as_header(), next_running_options);
				} catch (e) {
					mb = e.message;
				}
				let pos = [Math.floor(macroblock_types.length % mb_per_line) * 16, Math.floor(macroblock_types.length / mb_per_line) * 16];
				let motion_vectors = [MotionVector.zero(), MotionVector.zero(), MotionVector.zero(), MotionVector.zero()];
				var mb_type = null;
				var isStuffing = false;
				if (typeof mb == "string") {
					if (is_eof_error(mb)) {
						break;
					} else {
						throw new Error(mb);
					}
				} else {
					switch (mb.type) {
						case Macroblock.Stuffing:
							isStuffing = true;
							break;
						case Macroblock.Uncoded:
							if (next_decoded_picture.as_header().picture_type.type == PictureTypeCode.IFrame) throw new Error("UncodedIFrameBlocks");
							mb_type = new MacroblockType(MacroblockType.Inter);
							break;
						case Macroblock.Coded:
							var res = mb.value;
							let quantizer = asI8(asI8(in_force_quantizer) + ((res.d_quantizer === null) ? 0 : res.d_quantizer));
							in_force_quantizer = asU8(num_clamp(quantizer, 1, 31));
							if (res.mb_type.is_inter()) {
								let mv1 = res.motion_vector;
								if (mv1 === null) mv1 = MotionVector.zero();
								let mpred1 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 0);
								motion_vectors[0] = mv_decode(next_decoded_picture, next_running_options, mpred1, mv1);
								var addl_motion_vectors = res.addl_motion_vectors;
								if (addl_motion_vectors) {
									let mpred2 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 1);
									motion_vectors[1] = mv_decode(next_decoded_picture, next_running_options, mpred2, addl_motion_vectors[0]);
									let mpred3 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 2);
									motion_vectors[2] = mv_decode(next_decoded_picture, next_running_options, mpred3, addl_motion_vectors[1]);
									let mpred4 = predict_candidate(predictor_vectors, motion_vectors, mb_per_line, 3);
									motion_vectors[3] = mv_decode(next_decoded_picture, next_running_options, mpred4, addl_motion_vectors[2]);
								} else {
									motion_vectors[1] = motion_vectors[0];
									motion_vectors[2] = motion_vectors[0];
									motion_vectors[3] = motion_vectors[0];
								};
							}
							let luma0 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[0]);
							inverse_rle(luma0, luma_levels, pos, level_dimensions[0] / 8, in_force_quantizer);
							let luma1 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[1]);
							inverse_rle(luma1, luma_levels, [pos[0] + 8, pos[1]], level_dimensions[0] / 8, in_force_quantizer);
							let luma2 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[2]);
							inverse_rle(luma2, luma_levels, [pos[0], pos[1] + 8], level_dimensions[0] / 8, in_force_quantizer);
							let luma3 = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_luma[3]);
							inverse_rle(luma3, luma_levels, [pos[0] + 8, pos[1] + 8], level_dimensions[0] / 8, in_force_quantizer);
							let chroma_b = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_chroma_b);
							inverse_rle(chroma_b, chroma_b_levels, [pos[0] / 2, pos[1] / 2], mb_per_line, in_force_quantizer);
							let chroma_r = decode_block(reader, this.decoderOptions, next_decoded_picture.as_header(), next_running_options, res.mb_type, res.coded_block_pattern.codes_chroma_r);
							inverse_rle(chroma_r, chroma_r_levels, [pos[0] / 2, pos[1] / 2], mb_per_line, in_force_quantizer);
							mb_type = res.mb_type;
							break;
					}
					if (isStuffing) continue;
				}
				predictor_vectors.push(motion_vectors);
				macroblock_types.push(mb_type);
			}
			while (predictor_vectors.length < MAX_L) predictor_vectors.push(MotionVector.zero());
			while (macroblock_types.length < MAX_L) macroblock_types.push(new MacroblockType(MacroblockType.Inter));
			gather(macroblock_types, reference_picture, predictor_vectors, mb_per_line, next_decoded_picture);
			idct_channel(luma_levels, next_decoded_picture.as_luma_mut(), mb_per_line * 2, (output_dimensions[0]));
			let chroma_samples_per_row = next_decoded_picture.chroma_samples_per_row;
			idct_channel(chroma_b_levels, next_decoded_picture.as_chroma_b_mut(), mb_per_line, chroma_samples_per_row);
			idct_channel(chroma_r_levels, next_decoded_picture.as_chroma_r_mut(), mb_per_line, chroma_samples_per_row);
			if (next_decoded_picture.as_header().picture_type.type == PictureTypeCode.IFrame) this.reference_picture = null;
			let this_tr = next_decoded_picture.as_header().temporal_reference;
			this.last_picture = this_tr;
			if (!next_decoded_picture.as_header().picture_type.is_disposable()) this.reference_picture = this_tr;
			this.reference_states.set(this_tr, next_decoded_picture);
			this.cleanup_buffers();
		}
	}
	class H263Reader {
		constructor(source) {
			this.source = source;
			this.bitsRead = 0;
		}
		readBits(bitsNeeded) {
			let r = this.peekBits(bitsNeeded);
			this.skipBits(bitsNeeded);
			return r;
		}
		readSignedBits(bitsNeeded) {
			let uval = this.readBits(bitsNeeded);
			var shift = 32 - bitsNeeded;
			return (uval << shift) >> shift;
		}
		peekBits(bitsNeeded) {
			if (bitsNeeded == 0) return 0;
			let accum = 0;
			var i = bitsNeeded;
			let last_bits_read = this.bitsRead;
			while (i--) {
				if (bitsNeeded == 0)
					break;
				let bytes_read = Math.floor(this.bitsRead / 8);
				let bits_read = (this.bitsRead % 8);
				if (bytes_read >= this.source.length) {
					throw new Error("EndOfFile");
				}
				let byte = this.source[bytes_read];
				accum <<= 1;
				accum |= ((byte >> (7 - bits_read)) & 0x1);
				this.bitsRead++;
			}
			this.bitsRead = last_bits_read;
			return accum;
		}
		skipBits(bits_to_skip) {
			this.bitsRead += bits_to_skip;
		}
		readUint8() {
			return this.readBits(8);
		}
		recognizeStartCode(in_error) {
			return this.withLookahead(function (reader) {
				let max_skip_bits = reader.realignmentBits();
				let skip_bits = 0;
				let maybe_code = reader.peekBits(17);
				while (maybe_code != 1) {
					if (!in_error && skip_bits > max_skip_bits) {
						return null;
					}
					reader.skipBits(1);
					skip_bits += 1;
					maybe_code = reader.peekBits(17);
				}
				return skip_bits;
			});
		}
		realignmentBits() {
			return (8 - (this.bitsRead % 8)) % 8;
		}
		checkpoint() {
			return this.bitsRead;
		}
		readVLC(table) {
			var index = 0;
			while (true) {
				var res = table[index];
				if (res) {
					switch (res.type) {
						case VlcEntry.End:
							return res.value;
						case VlcEntry.Fork:
							let next_bit = this.readBits(1);
							if (next_bit == 0) {
								index = res.value[0];
							} else {
								index = res.value[1];
							}
							break;
					}
				} else {
					throw new Error("InternalDecoderError");
				}
			}
		}
		read_umv() {
			let start = this.readBits(1);
			if (start == 1) return HalfPel.from_unit(0);
			let mantissa = 0;
			let bulk = 1;
			while (bulk < 4096) {
				var r = this.readBits(2);
				switch (r) {
					case 0b00:
						return HalfPel.from_unit(mantissa + bulk);
					case 0b10:
						return HalfPel.from_unit(-(mantissa + bulk));
					case 0b01:
						mantissa <<= 1;
						bulk <<= 1;
						break;
					case 0b11:
						mantissa = mantissa << 1 | 1;
						bulk <<= 1;
						break;
				}
			}
			throw new Error("InvalidMvd");
		}
		bitAva() {
			return (this.source.length * 8) - this.bitsRead;
		}
		rollback(checkpoint) {
			if (checkpoint > (this.source.length * 8)) throw new Error("InternalDecoderError");
			this.bitsRead = checkpoint;
		}
		withTransaction(f) {
			var checkpoint = this.checkpoint();
			let result;
			try {
				result = f(this);
			} catch (e) {
				this.rollback(checkpoint);
				throw e;
			}
			return result;
		}
		withTransactionUnion(f) {
			var checkpoint = this.checkpoint();
			let result;
			try {
				result = f(this);
				if (result === null) this.rollback(checkpoint);
			} catch (e) {
				this.rollback(checkpoint);
				throw e;
			}
			return result;
		}
		withLookahead(f) {
			var checkpoint = this.checkpoint();
			let result = f(this);
			this.rollback(checkpoint);
			return result;
		}
	}
	return {
		H263Reader,
		H263State
	}
}());
var AT_VP6_Decoder = (function() {
	function validate(isH) {
		if (!isH) throw new Error("ValidationError");
	}
	const asU8 = function(num) {
		return (num << 24) >>> 24;
	}
	const asI16 = function(num) {
		return (num << 16) >> 16;
	}
	const asU16 = function(num) {
		return (num << 16) >>> 16;
	}
	const asU32 = function(num) {
		return num >>> 0;
	}
	class Bits {
		constructor(src) {
			this.src = src;
			this.bytePos = 0;
			this.bitPos = 0;
		}
		read(n) {
			var value = 0;
			while (n--) (value <<= 1), (value |= this.readBit());
			return value;
		}
		readBit() {
			var val = (this.src[this.bytePos] >> (7 - this.bitPos++)) & 0x1;
			if (this.bitPos > 7) {
				this.bytePos++;
				this.bitPos = 0;
			}
			return val;
		}
		read_bool() {
			return !!this.readBit();
		}
		tell() {
			return (this.bytePos * 8) + this.bitPos;
		}
	}
	function edge_emu(src, xpos, ypos, bw, bh, dst, dstride, comp, align) {
		let stride = src.get_stride(comp);
		let offs   = src.get_offset(comp);
		let [w_, h_] = src.get_dimensions(comp);
		let [hss, vss] = src.get_info().get_format().get_chromaton(comp).get_subsampling();
		let data = src.get_data();
		let framebuf = data;
		let w, h;
		if (align == 0) {
			w = w_;
			h = h_;
		} else {
			let wa = (align > hss) ? (1 << (align - hss)) - 1 : 0;
			let ha = (align > vss) ? (1 << (align - vss)) - 1 : 0;
			w = (w_ + wa) - wa;
			h = (h_ + ha) - ha;
		}
		for (let y = 0; y < bh; y++) {
			let srcy;
			if (y + ypos < 0) {
				srcy = 0;
			} else if ((y) + ypos >= (h)) {
				srcy = h - 1;
			} else {
				srcy = ((y) + ypos);
			}
			for (let x = 0; x < bw; x++) {
				let srcx;
				if ((x) + xpos < 0) {
					srcx = 0;
				} else if ((x) + xpos >= (w)) {
					srcx = w - 1;
				} else {
					srcx = ((x) + xpos);
				}
				dst[x + y * dstride] = framebuf[offs + srcx + srcy * stride];
			}
		}
	}
	class MV {
		constructor(x, y) {
			this.x = asI16(x);
			this.y = asI16(y);
		}
		add(other) {
			return new MV(this.x + other.x, this.y + other.y);
		}
		eq(other) {
			return (this.x == other.x) && (this.y == other.y);
		}
	}
	const ZERO_MV = new MV(0, 0);
	const ZIGZAG = new Uint32Array([0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28, 35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63]);
	class YUVSubmodel {
		constructor(type) {
			this.type = type;
		}
	}
	YUVSubmodel.YCbCr = 1;
	YUVSubmodel.YIQ = 2;
	YUVSubmodel.YUVJ = 3;
	class ColorModel {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	ColorModel.RGB = 1;
	ColorModel.YUV = 2;
	ColorModel.CMYK = 3;
	ColorModel.HSV = 4;
	ColorModel.LAB = 5;
	ColorModel.XYZ = 6;
	class NAPixelChromaton {
		constructor(data) {
			this.h_ss = data.h_ss;
			this.v_ss = data.v_ss;
			this.packed = data.packed;
			this.depth = data.depth;
			this.shift = data.shift;
			this.comp_offs = data.comp_offs;
			this.next_elem = data.next_elem;
		}
		get_subsampling() {
			return [this.h_ss, this.v_ss];
		}
		is_packed() {
			return this.packed;
		}
		get_depth() {
			return this.depth;
		}
		get_shift() {
			return this.shift;
		}
		get_offset() {
			return this.comp_offs;
		}
		get_step() {
			return this.next_elem;
		}
		get_width(width) {
			return (width + ((1 << this.h_ss) - 1)) >> this.h_ss;
		}
		get_height(height) {
			return (height + ((1 << this.v_ss) - 1)) >> this.v_ss;
		}
		get_linesize(width) {
			let d = this.depth;
			if (this.packed) {
				return (this.get_width(width) * d + d - 1) >> 3;
			} else {
				return this.get_width(width);
			}
		}
		get_data_size() {
			let nh = (height + ((1 << this.v_ss) - 1)) >> this.v_ss;
			return (this.get_linesize(width) * nh);
		}
	}
	class NAPixelFormaton {
		constructor(data) {
			this.model = data.model;
			this.components = data.components;
			this.comp_info = data.comp_info;
			this.elem_size = data.elem_size;
			this.be = data.be;
			this.alpha = data.alpha;
			this.palette = data.palette;
		}
		get_model() {
			return this.model;
		}
		get_num_comp() {
			return this.components;
		}
		get_chromaton(i) {
			return this.comp_info[i];
		}
		is_be() {
			return this.be;
		}
		has_alpha() {
			return this.alpha;
		}
		is_paletted() {
			return this.palette;
		}
		get_elem_size() {
			return this.elem_size;
		}
	}
	const YUV420_FORMAT = new NAPixelFormaton({
		model: new ColorModel(ColorModel.YUV, new YUVSubmodel(YUVSubmodel.YUVJ)),
		components: 3,
		comp_info: [new NAPixelChromaton({ h_ss: 0, v_ss: 0, packed: false, depth: 8, shift: 0, comp_offs: 0, next_elem: 1 }), new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 1, next_elem: 1 }), new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 2, next_elem: 1 }), null, null],
		elem_size: 0,
		be: false,
		alpha: false,
		palette: false
	});
	class NAVideoInfo {
		constructor(w, h, flip, fmt) {
			this.width = w;
			this.height = h;
			this.flipped = flip;
			this.format = fmt;
		}
		get_width() {
			return this.width;
		}
		get_height() {
			return this.height;
		}
		is_flipped() {
			return this.flipped;
		}
		get_format() {
			return this.format;
		}
		set_width(w) {
			this.width = w;
		}
		set_height(h) {
			this.height = h;
		}
		eq(other) {
			return this.width == other.width && this.height == other.height && this.flipped == other.flipped;
		}
	}
	function get_plane_size(info, idx) {
		let chromaton = info.get_format().get_chromaton(idx);
		if (chromaton === null) {
			return [0, 0];
		}
		let [hs, vs] = chromaton.get_subsampling();
		let w = (info.get_width() + ((1 << hs) - 1)) >> hs;
		let h = (info.get_height() + ((1 << vs) - 1)) >> vs;
		return [w, h];
	}
	class NAVideoBuffer {
		constructor(data) {
			this.info = data.info;
			this.data = data.data;
			this.offs = data.offs;
			this.strides = data.strides;
		}
		get_num_refs() {
			return 1;
		}
		get_info() {
			return this.info;
		}
		get_data() {
			return this.data;
		}
		get_dimensions(idx) {
			return get_plane_size(this.info, idx);
		}
		get_offset(idx) {
			if (idx >= this.offs.length) {
				return 0;
			} else {
				return this.offs[idx];
			}
		}
		get_stride(idx) {
			if (idx >= this.strides.length) {
				return 0;
			}
			return this.strides[idx];
		}
		cloned() {
			return new NAVideoBuffer({
				info: this.info,
				data: this.data.slice(0),
				offs: this.offs,
				strides: this.strides
			});
		}
	}
	class NABufferType {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
		get_vbuf() {
			return this.value;
		}
	}
	NABufferType.Video = 1;
	NABufferType.Video16 = 2;
	NABufferType.Video32 = 3;
	NABufferType.VideoPacked = 4;
	NABufferType.Data = 5;
	NABufferType.None = 6;
	const NA_SIMPLE_VFRAME_COMPONENTS = 4;
	class NASimpleVideoFrame {
		constructor(data) {
			this.width = data.width;
			this.height = data.height;
			this.flip = data.flip;
			this.stride = data.stride;
			this.offset = data.offset;
			this.components = data.components;
			this.data = data.data;
		}
		static from_video_buf(vbuf) {
			let vinfo = vbuf.get_info();
			let components = vinfo.format.components;
			if (components > NA_SIMPLE_VFRAME_COMPONENTS) return null;
			let w = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
			let h = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
			let s = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
			let o = new Uint32Array(NA_SIMPLE_VFRAME_COMPONENTS);
			for (var comp = 0; comp < components; comp++) {
				let [width, height] = vbuf.get_dimensions(comp);
				w[comp] = width;
				h[comp] = height;
				s[comp] = vbuf.get_stride(comp);
				o[comp] = vbuf.get_offset(comp);
			}
			let flip = vinfo.flipped;
			return new NASimpleVideoFrame({
				width: w,
				height: h,
				flip,
				stride: s,
				offset: o,
				components,
				data: vbuf.data,
			});
		}
	}
	function alloc_video_buffer(vinfo, align) {
		let fmt = vinfo.format;
		let new_size = 0;
		let offs = [];
		let strides = [];
		for (var i = 0; i < fmt.get_num_comp(); i++) {
			if (!fmt.get_chromaton(i)) {
				throw new Error("AllocatorError::FormatError");
			}
		}
		let align_mod = (1 << align) - 1;
		let width = (vinfo.width + align_mod) - align_mod;
		let height = (vinfo.height + align_mod) - align_mod;
		let max_depth = 0;
		let all_packed = true;
		for (var i = 0; i < fmt.get_num_comp(); i++) {
			let ochr = fmt.get_chromaton(i);
			if (!ochr) continue;
			let chr = ochr;
			if (!chr.is_packed()) {
				all_packed = false;
			}
			max_depth = Math.max(max_depth, chr.get_depth());
		}
		let unfit_elem_size = false;
		switch(fmt.get_elem_size()) {
			case 2:
			case 4:
				unfit_elem_size = true;
				break;
		}
		unfit_elem_size = !unfit_elem_size;
		if (!all_packed) {
			for (var i = 0; i < fmt.get_num_comp(); i++) {
				let ochr = fmt.get_chromaton(i);
				if (!ochr) continue;
				let chr = ochr;
				offs.push(new_size);
				let stride = chr.get_linesize(width);
				let cur_h = chr.get_height(height);
				let cur_sz = (stride * cur_h);
				let new_sz = (new_size + cur_sz);
				new_size = new_sz;
				strides.push(stride);
			}
			if (max_depth <= 8) {
				let data = new Uint8Array(new_size);
				let buf = new NAVideoBuffer({
					data: data,
					info: vinfo,
					offs,
					strides
				});
				return new NABufferType(NABufferType.Video, buf);
			}
		}
	}
	class NAVideoBufferPool {
		constructor(max_len) {
			this.pool = [];
			this.max_len = max_len;
			this.add_len = 0;
		}
		set_dec_bufs(add_len) {
			this.add_len = add_len;
		}
		reset() {
			this.pool = [];
		}
		prealloc_video(vinfo, align) {
			let nbufs = this.max_len + this.add_len - this.pool.length;
			for (var _ = 0; _ < nbufs; _++) {
				let vbuf = alloc_video_buffer(vinfo, align);
				var buf = vbuf.value;
				this.pool.push(buf);
			}
		}
		get_free() {
			for (var i = 0; i < this.pool.length; i++) {
				var e = this.pool[i];
				if (e.get_num_refs() == 1)
					return e;
			}
			return null;
		}
		get_info() {
			if (this.pool.length) {
				return (this.pool[0].get_info());
			} else {
				return null;
			}
		}
		get_copy(rbuf) {
			let dbuf = this.get_free().cloned();
			dbuf.data.set(rbuf.data, 0);
			return dbuf;
		}
	}
	class NADecoderSupport {
		constructor() {
			this.pool_u8 = new NAVideoBufferPool(0);
		}
	}
	const VERSION_VP60 = 6;
	const VERSION_VP62 = 8;
	const VP6_SIMPLE_PROFILE = 0;
	const VP6_ADVANCED_PROFILE = 3;
	const LONG_VECTOR_ORDER = new Uint32Array([0, 1, 2, 7, 6, 5, 4]);
	const NZ_PROBS = new Uint8Array([162, 164]);
	const RAW_PROBS = [new Uint8Array([247, 210, 135, 68, 138, 220, 239, 246]),new Uint8Array([244, 184, 201, 44, 173, 221, 239, 253])];
	const TREE_PROBS = [new Uint8Array([225, 146, 172, 147, 214,  39, 156]),new Uint8Array([204, 170, 119, 235, 140, 230, 228])];
	const ZERO_RUN_PROBS = [new Uint8Array([198, 197, 196, 146, 198, 204, 169, 142, 130, 136, 149, 149, 191, 249]),new Uint8Array([135, 201, 181, 154,  98, 117, 132, 126, 146, 169, 184, 240, 246, 254])];
	const HAS_NZ_PROB = new Uint8Array([237, 231]);
	const HAS_SIGN_PROB = new Uint8Array([246, 243]);
	const HAS_TREE_PROB = [new Uint8Array([253, 253, 254, 254, 254, 254, 254]), new Uint8Array([245, 253, 254, 254, 254, 254, 254])];
	const HAS_RAW_PROB = [new Uint8Array([254, 254, 254, 254, 254, 250, 250, 252]), new Uint8Array([254, 254, 254, 254, 254, 251, 251, 254])];
	const HAS_COEF_PROBS = [new Uint8Array([146, 255, 181, 207, 232, 243, 238, 251, 244, 250, 249]),new Uint8Array([179, 255, 214, 240, 250, 255, 244, 255, 255, 255, 255])];
	const HAS_SCAN_UPD_PROBS = new Uint8Array([0, 132, 132, 159, 153, 151, 161, 170, 164, 162, 136, 110, 103, 114, 129, 118, 124, 125, 132, 136, 114, 110, 142, 135, 134, 123, 143, 126, 153, 183, 166, 161, 171, 180, 179, 164, 203, 218, 225, 217, 215, 206, 203, 217, 229, 241, 248, 243, 253, 255, 253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]);
	const HAS_ZERO_RUN_PROBS = [new Uint8Array([219, 246, 238, 249, 232, 239, 249, 255, 248, 253, 239, 244, 241, 248]),new Uint8Array([198, 232, 251, 253, 219, 241, 253, 255, 248, 249, 244, 238, 251, 255])];
	const VP6_AC_PROBS = [[[new Uint8Array([227, 246, 230, 247, 244, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 209, 231, 231, 249, 249, 253, 255, 255, 255]),new Uint8Array([255, 255, 225, 242, 241, 251, 253, 255, 255, 255, 255]),new Uint8Array([255, 255, 241, 253, 252, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 248, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])], [new Uint8Array([240, 255, 248, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 240, 253, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])]], [[new Uint8Array([206, 203, 227, 239, 247, 255, 253, 255, 255, 255, 255]),new Uint8Array([207, 199, 220, 236, 243, 252, 252, 255, 255, 255, 255]),new Uint8Array([212, 219, 230, 243, 244, 253, 252, 255, 255, 255, 255]),new Uint8Array([236, 237, 247, 252, 253, 255, 255, 255, 255, 255, 255]),new Uint8Array([240, 240, 248, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])], [new Uint8Array([230, 233, 249, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([238, 238, 250, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([248, 251, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])]], [[new Uint8Array([225, 239, 227, 231, 244, 253, 243, 255, 255, 253, 255]),new Uint8Array([232, 234, 224, 228, 242, 249, 242, 252, 251, 251, 255]),new Uint8Array([235, 249, 238, 240, 251, 255, 249, 255, 253, 253, 255]),new Uint8Array([249, 253, 251, 250, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([251, 250, 249, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])], [new Uint8Array([243, 244, 250, 250, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([249, 248, 250, 253, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([253, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255]),new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255])]]];
	const VP6_DC_WEIGHTS = [[new Int16Array([122, 133]),new Int16Array([133, 51]),new Int16Array([142, -16])], [new Int16Array([0, 1]),new Int16Array([0, 1]),new Int16Array([0, 1])], [new Int16Array([78, 171]),new Int16Array([169, 71]),new Int16Array([221, -30])], [new Int16Array([139, 117]),new Int16Array([214, 44]),new Int16Array([246, -3])], [new Int16Array([168, 79]),new Int16Array([210, 38]),new Int16Array([203, 17])]];
	const VP6_IDX_TO_AC_BAND = new Uint32Array([0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
	const VP6_BICUBIC_COEFFS = [[new Int16Array([0, 128, 0, 0]), new Int16Array([-3, 122, 9, 0]), new Int16Array([-4, 109, 24, -1]), new Int16Array([-5, 91, 45, -3]), new Int16Array([-4, 68, 68, -4]), new Int16Array([-3, 45, 91, -5]), new Int16Array([-1, 24, 109, -4]), new Int16Array([ 0, 9, 122, -3])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-4, 124, 9, -1]), new Int16Array([-5, 110, 25, -2]), new Int16Array([-6, 91, 46, -3]), new Int16Array([-5, 69, 69, -5]), new Int16Array([-3, 46, 91, -6]), new Int16Array([-2, 25, 110, -5]), new Int16Array([-1, 9, 124, -4])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-4, 123, 10, -1]), new Int16Array([-6, 110, 26, -2]), new Int16Array([-7, 92, 47, -4]), new Int16Array([-6, 70, 70, -6]), new Int16Array([-4, 47, 92, -7]), new Int16Array([-2, 26, 110, -6]), new Int16Array([-1, 10, 123, -4])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-5, 124, 10, -1]), new Int16Array([-7, 110, 27, -2]), new Int16Array([-7, 91, 48, -4]), new Int16Array([-6, 70, 70, -6]), new Int16Array([-4, 48, 92, -8]), new Int16Array([-2, 27, 110, -7]), new Int16Array([-1, 10, 124, -5])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-6, 124, 11, -1]), new Int16Array([-8, 111, 28, -3]), new Int16Array([-8, 92, 49, -5]), new Int16Array([-7, 71, 71, -7]), new Int16Array([-5, 49, 92, -8]), new Int16Array([-3, 28, 111, -8]), new Int16Array([-1, 11, 124, -6])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-6, 123, 12, -1]), new Int16Array([-9, 111, 29, -3]), new Int16Array([-9, 93, 50, -6]), new Int16Array([-8, 72, 72, -8]), new Int16Array([-6, 50, 93, -9]), new Int16Array([-3, 29, 111, -9]), new Int16Array([-1, 12, 123, -6])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-7, 124, 12, -1]), new Int16Array([-10, 111, 30, -3]), new Int16Array([-10, 93, 51, -6]), new Int16Array([-9, 73, 73, -9]), new Int16Array([-6, 51, 93, -10]), new Int16Array([-3, 30, 111, -10]), new Int16Array([-1, 12, 124, -7])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-7, 123, 13, -1]), new Int16Array([-11, 112, 31, -4]), new Int16Array([-11, 94, 52, -7]), new Int16Array([-10, 74, 74, -10]), new Int16Array([-7, 52, 94, -11]), new Int16Array([-4, 31, 112, -11]), new Int16Array([-1, 13, 123, -7])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-8, 124, 13, -1]), new Int16Array([-12, 112, 32, -4]), new Int16Array([-12, 94, 53, -7]), new Int16Array([-10, 74, 74, -10]), new Int16Array([-7, 53, 94, -12]), new Int16Array([-4, 32, 112, -12]), new Int16Array([-1, 13, 124, -8])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-9, 124, 14, -1]), new Int16Array([-13, 112, 33, -4]), new Int16Array([-13, 95, 54, -8]), new Int16Array([-11, 75, 75, -11]), new Int16Array([-8, 54, 95, -13]), new Int16Array([-4, 33, 112, -13]), new Int16Array([-1, 14, 124, -9])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-9, 123, 15, -1]), new Int16Array([-14, 113, 34, -5]), new Int16Array([-14, 95, 55, -8]), new Int16Array([-12, 76, 76, -12]), new Int16Array([-8, 55, 95, -14]), new Int16Array([-5, 34, 112, -13]), new Int16Array([-1, 15, 123, -9])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-10, 124, 15, -1]), new Int16Array([-14, 113, 34, -5]), new Int16Array([-15, 96, 56, -9]), new Int16Array([-13, 77, 77, -13]), new Int16Array([-9, 56, 96, -15]), new Int16Array([-5, 34, 113, -14]), new Int16Array([-1, 15, 124, -10])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-10, 123, 16, -1]), new Int16Array([-15, 113, 35, -5]), new Int16Array([-16, 98, 56, -10]), new Int16Array([-14, 78, 78, -14]), new Int16Array([-10, 56, 98, -16]), new Int16Array([-5, 35, 113, -15]), new Int16Array([-1, 16, 123, -10])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-11, 124, 17, -2]), new Int16Array([-16, 113, 36, -5]), new Int16Array([-17, 98, 57, -10]), new Int16Array([-14, 78, 78, -14]), new Int16Array([-10, 57, 98, -17]), new Int16Array([-5, 36, 113, -16]), new Int16Array([-2, 17, 124, -11])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-12, 125, 17, -2]), new Int16Array([-17, 114, 37, -6]), new Int16Array([-18, 99, 58, -11]), new Int16Array([-15, 79, 79, -15]), new Int16Array([-11, 58, 99, -18]), new Int16Array([-6, 37, 114, -17]), new Int16Array([-2, 17, 125, -12])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-12, 124, 18, -2]), new Int16Array([-18, 114, 38, -6]), new Int16Array([-19, 99, 59, -11]), new Int16Array([-16, 80, 80, -16]), new Int16Array([-11, 59, 99, -19]), new Int16Array([-6, 38, 114, -18]), new Int16Array([-2, 18, 124, -12])], [new Int16Array([0, 128, 0, 0]), new Int16Array([-4, 118, 16, -2]), new Int16Array([-7, 106, 34, -5]), new Int16Array([-8,  90, 53, -7]), new Int16Array([-8,  72, 72, -8]), new Int16Array([-7,  53, 90, -8]), new Int16Array([-5,  34, 106, -7]), new Int16Array([-2,  16, 118, -4])]];
	const VP6_DEFAULT_SCAN_ORDER = new Uint32Array([0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15]);
	const VP6_INTERLACED_SCAN_ORDER = new Uint32Array([0, 1, 0, 1, 1, 2, 5, 3, 2, 2, 2, 2, 4, 7, 8, 10, 9, 7, 5, 4, 2, 3, 5, 6, 8, 9, 11, 12, 13, 12, 11, 10, 9, 7, 5, 4, 6, 7, 9, 11, 12, 12, 13, 13, 14, 12, 11, 9, 7, 9, 11, 12, 14, 14, 14, 15, 13, 11, 13, 15, 15, 15, 15, 15]);
	const VP_YUVA420_FORMAT = new NAPixelFormaton({
		model: new ColorModel(ColorModel.YUV, new YUVSubmodel(YUVSubmodel.YUVJ)),
		components: 4,
		comp_info:  [new NAPixelChromaton({ h_ss: 0, v_ss: 0, packed: false, depth: 8, shift: 0, comp_offs: 0, next_elem: 1}), new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 1, next_elem: 1}), new NAPixelChromaton({ h_ss: 1, v_ss: 1, packed: false, depth: 8, shift: 0, comp_offs: 2, next_elem: 1}), new NAPixelChromaton({ h_ss: 0, v_ss: 0, packed: false, depth: 8, shift: 0, comp_offs: 3, next_elem: 1}), null],
		elem_size: 0,
		be: false,
		alpha: true,
		palette: false
	});
	const VP_REF_INTER = 1;
	const VP_REF_GOLDEN = 2;
	class VPMBType {
		constructor(type) {
			this.type = type;
		}
		is_intra() {
			return this.type == VPMBType.Intra;
		}
		get_ref_id() {
			switch (this.type) {
				case VPMBType.Intra:
					return 0;
				case VPMBType.InterNoMV:
				case VPMBType.InterMV:
				case VPMBType.InterNearest:
				case VPMBType.InterNear:
				case VPMBType.InterFourMV:
					return VP_REF_INTER;
				default:
					return VP_REF_GOLDEN;
			}
		}
	}
	VPMBType.Intra = 1;
	VPMBType.InterNoMV = 2;
	VPMBType.InterMV = 3;
	VPMBType.InterNearest = 4;
	VPMBType.InterNear = 5;
	VPMBType.InterFourMV = 6;
	VPMBType.GoldenNoMV = 7;
	VPMBType.GoldenMV = 8;
	VPMBType.GoldenNearest = 9;
	VPMBType.GoldenNear = 10;
	class VPShuffler {
		constructor() {
			this.lastframe = null;
			this.goldframe = null;
		}
		clear() {
			this.lastframe = null;
			this.goldframe = null;
		}
		add_frame(buf) {
			this.lastframe = buf;
		}
		add_golden_frame(buf) {
			this.goldframe = buf;
		}
		get_last() {
			return this.lastframe;
		}
		get_golden() {
			return this.goldframe;
		}
		has_refs() {
			return !!this.lastframe;
		}
	}
	const VP56_COEF_BASE = new Int16Array([5, 7, 11, 19, 35, 67]);
	const VP56_COEF_ADD_PROBS = [new Uint8Array([159, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new Uint8Array([165, 145, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0]), new Uint8Array([173, 148, 140, 128, 0, 0, 0, 0, 0, 0, 0, 0]), new Uint8Array([176, 155, 140, 135, 128, 0, 0, 0, 0, 0, 0, 0]), new Uint8Array([180, 157, 141, 134, 130, 128, 0, 0, 0, 0, 0, 0]), new Uint8Array([254, 254, 243, 230, 196, 177, 153, 140, 133, 130, 129, 128])];
	const ff_vp56_norm_shift = new Uint8Array([8, 7, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	class BoolCoder {
		constructor(src) {
			if (src.length < 3)
				throw new Error("DecoderError::ShortData");
			let value = asU32(asU32(src[0] << 24) | asU32(src[1] << 16) | asU32(src[2] << 8) | asU32(src[3]));
			this.src = src;
			this.pos = 4;
			this.value = value;
			this.range = 255;
			this.bits = 8;
		}
		read_bool() {
			return this.read_prob(128);
		}
		read_prob(prob) {
			this.renorm();
			let split = asU32(1 + asU32((asU32(this.range - 1) * asU32(prob)) >> 8));
			let bit;
			if (asU32(this.value) < asU32(split << 24)) {
				this.range = split;
				bit = false;
			} else {
				this.range -= split;
				this.range = asU32(this.range);
				this.value -= asU32(split << 24);
				this.value = asU32(this.value);
				bit = true;
			}
			return bit;
		}
		read_bits(bits) {
			let val = 0;
			for (var i = 0; i < bits; i++) {
				val = (val << 1) | asU32(this.read_prob(128));
				val = asU32(val);
			}
			return asU32(val);
		}
		read_probability() {
			let val = asU8(this.read_bits(7));
			if (val == 0) {
				return 1;
			} else {
				return asU8(val << 1);
			}
		}
		renorm() {
			let shift = ff_vp56_norm_shift[this.range];
			this.range <<= shift;
			this.value <<= shift;
			this.range = asU32(this.range);
			this.value = asU32(this.value);
			this.bits -= shift;
			if ((this.bits <= 0) && (this.pos < this.src.length)) {
				this.value |= (this.src[this.pos] << asU8(-this.bits));
				this.pos += 1;
				this.bits += 8;
			}
		}
		skip_bytes(nbytes) {
			for (var i = 0; i < nbytes; i++) {
				this.value <<= 8;
				if (this.pos < this.src.length) {
					this.value |= (this.src[this.pos]);
					this.pos += 1;
				}
			}
		}
	}
	function rescale_prob(prob, weights, maxval) {
		return asU8(Math.max(Math.min((((asU8(prob) * weights[0] + 128) >> 8) + weights[1]), maxval), 1));
	}
	const C1S7 = 64277;
	const C2S6 = 60547;
	const C3S5 = 54491;
	const C4S4 = 46341;
	const C5S3 = 36410;
	const C6S2 = 25080;
	const C7S1 = 12785;
	function mul16(a, b) {
		return (a * b) >> 16;
	}
	function vp_idct(coeffs) {
		let i, t_a, t_b, t_c, t_d, t_a1, t_b1, t_e, t_f, t_g, t_h, t_e1;
		let tmp = new Int32Array(64);
		for (i = 0; i < 64; i += 8) {
			t_a = mul16(C1S7, (coeffs[i + 1])) + mul16(C7S1, coeffs[i + 7]);
			t_b = mul16(C7S1, (coeffs[i + 1])) - mul16(C1S7, coeffs[i + 7]);
			t_c = mul16(C3S5, (coeffs[i + 3])) + mul16(C5S3, coeffs[i + 5]);
			t_d = mul16(C3S5, (coeffs[i + 5])) - mul16(C5S3, coeffs[i + 3]);
			t_a1 = mul16(C4S4, t_a - t_c);
			t_b1 = mul16(C4S4, t_b - t_d);
			t_c = t_a + t_c;
			t_d = t_b + t_d;
			t_e = mul16(C4S4, (coeffs[i] + coeffs[i + 4]));
			t_f = mul16(C4S4, (coeffs[i] - coeffs[i + 4]));
			t_g = mul16(C2S6, (coeffs[i + 2])) + mul16(C6S2, (coeffs[i + 6]));
			t_h = mul16(C6S2, (coeffs[i + 2])) - mul16(C2S6, (coeffs[i + 6]));
			t_e1 = t_e - t_g;
			t_g = t_e + t_g;
			t_a = t_f + t_a1;
			t_f = t_f - t_a1;
			t_b = t_b1 - t_h;
			t_h = t_b1 + t_h;
			tmp[i] = (t_g + t_c) | 0;
			tmp[i + 1] = (t_a + t_h) | 0;
			tmp[i + 2] = (t_a - t_h) | 0;
			tmp[i + 3] = (t_e1 + t_d) | 0;
			tmp[i + 4] = (t_e1 - t_d) | 0;
			tmp[i + 5] = (t_f + t_b) | 0;
			tmp[i + 6] = (t_f - t_b) | 0;
			tmp[i + 7] = (t_g - t_c) | 0;
		}
		for (i = 0; i < 8; i++) {
			t_a = mul16(C1S7, (tmp[8 + i])) + mul16(C7S1, tmp[56 + i]);
			t_b = mul16(C7S1, (tmp[8 + i])) - mul16(C1S7, tmp[56 + i]);
			t_c = mul16(C3S5, (tmp[24 + i])) + mul16(C5S3, tmp[40 + i]);
			t_d = mul16(C3S5, (tmp[40 + i])) - mul16(C5S3, tmp[24 + i]);
			t_a1 = mul16(C4S4, t_a - t_c);
			t_b1 = mul16(C4S4, t_b - t_d);
			t_c = t_a + t_c;
			t_d = t_b + t_d;
			t_e = mul16(C4S4, (tmp[i] + tmp[32 + i])) + 8;
			t_f = mul16(C4S4, (tmp[i] - tmp[32 + i])) + 8;
			t_g = mul16(C2S6, (tmp[16 + i])) + mul16(C6S2, (tmp[48 + i]));
			t_h = mul16(C6S2, (tmp[16 + i])) - mul16(C2S6, (tmp[48 + i]));
			t_e1 = t_e - t_g;
			t_g = t_e + t_g;
			t_a = t_f + t_a1;
			t_f = t_f - t_a1;
			t_b = t_b1 - t_h;
			t_h = t_b1 + t_h;
			coeffs[i] = (t_g + t_c) >> 4;
			coeffs[8 + i] = (t_a + t_h) >> 4;
			coeffs[16 + i] = (t_a - t_h) >> 4;
			coeffs[24 + i] = (t_e1 + t_d) >> 4;
			coeffs[32 + i] = (t_e1 - t_d) >> 4;
			coeffs[40 + i] = (t_f + t_b) >> 4;
			coeffs[48 + i] = (t_f - t_b) >> 4;
			coeffs[56 + i] = (t_g - t_c) >> 4;
		}
	}
	function vp_idct_dc(coeffs) {
		let dc = asI16((mul16(C4S4, mul16(C4S4, coeffs[0])) + 8) >> 4);
		for (let i = 0; i < 64; i++) {
			coeffs[i] = dc;
		}
	}
	function vp_put_block(coeffs, bx, by, plane, frm) {
		var data = frm.data;
		vp_idct(coeffs);
		let off = frm.offset[plane] + ((bx * 8) + ((by * 8) * frm.stride[plane]));
		for (var y = 0; y < 8; y++) {
			for (var x = 0; x < 8; x++) {
				data[off + x] = Math.max(Math.min((coeffs[x + (y * 8)] + 128), 255), 0) | 0;
			}
			off += frm.stride[plane];
		}
	}
	function vp_put_block_ilace(coeffs, bx, by, plane, frm) {
		var data = frm.data;
		vp_idct(coeffs);
		let off = frm.offset[plane] + bx * 8 + ((by - 1) * 8 + (by + 1)) * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				data[off + x] = Math.max(Math.min((coeffs[x + y * 8] + 128), 255), 0) | 0;
			}
			off += frm.stride[plane] * 2;
		}
	}
	function vp_put_block_dc(coeffs, bx, by, plane, frm) {
		var data = frm.data;
		vp_idct_dc(coeffs);
		let dc = (Math.max(Math.min((coeffs[0] + 128), 255), 0)) | 0;
		let off = frm.offset[plane] + bx * 8 + by * 8 * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				data[off + x] = dc;
			}
			off += frm.stride[plane];
		}
	}
	function vp_add_block(coeffs, bx, by, plane, frm) {
		var data = frm.data;
		vp_idct(coeffs);
		let off = frm.offset[plane] + bx * 8 + by * 8 * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				data[off + x] = Math.max(Math.min((coeffs[x + y * 8] + asI16(data[off + x])), 255), 0) | 0;
			}
			off += frm.stride[plane];
		}
	}
	function vp_add_block_ilace(coeffs, bx, by, plane, frm) {
		var data = frm.data;
		vp_idct(coeffs);
		let off = frm.offset[plane] + bx * 8 + ((by - 1) * 8 + (by + 1)) * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				data[off + x] = Math.max(Math.min((coeffs[x + y * 8] + asI16(data[off + x])), 255), 0) | 0;
			}
			off += frm.stride[plane] * 2;
		}
	}
	function vp_add_block_dc(coeffs, bx, by, plane, frm) {
		var data = frm.data;
		vp_idct_dc(coeffs);
		let dc = coeffs[0];
		let off = frm.offset[plane] + bx * 8 + by * 8 * frm.stride[plane];
		for (let y = 0; y < 8; y++) {
			for (let x = 0; x < 8; x++) {
				data[off + x] = Math.max(Math.min((dc + asI16(data[off + x])), 255), 0) | 0;
			}
			off += frm.stride[plane];
		}
	}
	function vp31_loop_filter(data, off, step, stride, len, loop_str) {
		for (let _ = 0; _ < len; _++) {
			let a = asI16(data[off - step * 2]);
			let b = asI16(data[off - step]);
			let c = asI16(data[off]);
			let d = asI16(data[off + step]);
			let diff = ((a - d) + 3 * (c - b) + 4) >> 3;
			if (Math.abs(diff) >= 2 * loop_str) {
				diff = 0;
			} else if (Math.abs(diff) >= loop_str) {
				if (diff < 0) diff = -diff - 2 * loop_str;
				else diff = -diff + 2 * loop_str;
			}
			if (diff != 0) {
				data[off - step] = Math.min(Math.max((b + diff), 0), 255) | 0;
				data[off] = Math.min(Math.max((c - diff), 0), 255) | 0;
			}
			off += stride;
		}
	}
	class VP56Header {
		constructor() {
			this.is_intra = false;
			this.is_golden = false;
			this.quant = 0;
			this.multistream = false;
			this.use_huffman = false;
			this.version = 0;
			this.profile = 0;
			this.interlaced = false;
			this.offset = 0;
			this.mb_w = 0;
			this.mb_h = 0;
			this.disp_w = 0;
			this.disp_h = 0;
			this.scale = 0;
		}
	}
	class CoeffReader {
		constructor(type, value) {
			this.type = type;
			this.value = value;
		}
	}
	CoeffReader.None = 1;
	CoeffReader.Bool = 2;
	class VP56MVModel {
		constructor() {
			this.nz_prob = 0;
			this.sign_prob = 0;
			this.raw_probs = new Uint8Array(8);
			this.tree_probs = new Uint8Array(7);
		}
	}
	class VP56MBTypeModel {
		constructor() {
			this.probs = new Uint8Array(10);
		}
	}
	class VP56CoeffModel {
		constructor() {
			this.dc_token_probs = [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]];
			this.dc_value_probs = new Uint8Array(11);
			this.ac_ctype_probs = [[[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]], [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]], [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]]];
			this.ac_type_probs = [[[[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]], [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]], [[new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)], [new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5), new Uint8Array(5)]]]];
			this.ac_val_probs = [[new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11)], [new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11)], [new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11), new Uint8Array(11)]];
		}
	}
	class VP6Models {
		constructor() {
			this.scan_order = new Uint32Array(64);
			this.scan = new Uint32Array(64);
			this.zigzag = new Uint32Array(64);
			this.zero_run_probs = [new Uint8Array(14), new Uint8Array(14)];
		}
	}
	const VP56_DC_QUANTS = new Int16Array([47, 47, 47, 47, 45, 43, 43, 43, 43, 43, 42, 41, 41, 40, 40, 40, 40, 35, 35, 35, 35, 33, 33, 33, 33, 32, 32, 32, 27, 27, 26, 26, 25, 25, 24, 24, 23, 23, 19, 19, 19, 19, 18, 18, 17, 16, 16, 16, 16, 16, 15, 11, 11, 11, 10, 10, 9, 8, 7, 5, 3, 3, 2, 2]);
	const VP56_AC_QUANTS = new Int16Array([94, 92, 90, 88, 86, 82, 78, 74, 70, 66, 62, 58, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 40, 39, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10,  9, 8, 7, 6, 5, 4, 3, 2, 1]);
	const VP56_FILTER_LIMITS = new Uint8Array([14, 14, 13, 13, 12, 12, 10, 10, 10, 10,  8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 7, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 2]);
	const VP56_MODE_VQ = [[new Uint8Array([9, 15, 32, 25, 7, 19, 9, 21, 1, 12, 14, 12, 3, 18, 14, 23, 3, 10, 0, 4]), new Uint8Array([48, 39, 1, 2, 11, 27, 29, 44, 7, 27, 1, 4, 0, 3, 1, 6, 1, 2, 0, 0]), new Uint8Array([21, 32, 1, 2, 4, 10, 32, 43, 6, 23, 2, 3, 1, 19, 1, 6, 12, 21, 0, 7]), new Uint8Array([69, 83, 0, 0, 0, 2, 10, 29, 3, 12, 0, 1, 0, 3, 0, 3, 2, 2, 0, 0]), new Uint8Array([11, 20, 1, 4, 18, 36, 43, 48, 13, 35, 0, 2, 0, 5, 3, 12, 1, 2, 0, 0]), new Uint8Array([70, 44, 0, 1, 2, 10, 37, 46, 8, 26, 0, 2, 0, 2, 0, 2, 0, 1, 0, 0]), new Uint8Array([8, 15, 0, 1, 8, 21, 74, 53, 22, 42, 0, 1, 0, 2, 0, 3, 1, 2, 0, 0]), new Uint8Array([141, 42, 0, 0, 1, 4, 11, 24, 1, 11, 0, 1, 0, 1, 0, 2, 0, 0, 0, 0]), new Uint8Array([8, 19, 4, 10, 24, 45, 21, 37, 9, 29, 0, 3, 1, 7, 11, 25, 0, 2, 0, 1]), new Uint8Array([46, 42, 0, 1, 2, 10, 54, 51, 10, 30, 0, 2, 0, 2, 0, 1, 0, 1, 0, 0]), new Uint8Array([28, 32, 0, 0, 3, 10, 75, 51, 14, 33, 0, 1, 0, 2, 0, 1, 1, 2, 0, 0]), new Uint8Array([100, 46, 0, 1, 3, 9, 21, 37, 5, 20, 0, 1, 0, 2, 1, 2, 0, 1, 0, 0]), new Uint8Array([27, 29, 0, 1, 9, 25, 53, 51, 12, 34, 0, 1, 0, 3, 1, 5, 0, 2, 0, 0]), new Uint8Array([80, 38, 0, 0, 1, 4, 69, 33, 5, 16, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0]), new Uint8Array([16, 20, 0, 0, 2, 8, 104, 49, 15, 33, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0]), new Uint8Array([194, 16, 0, 0, 1, 1, 1, 9, 1, 3, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0])], [new Uint8Array([41, 22, 1, 0, 1, 31, 0, 0, 0, 0, 0, 1, 1, 7, 0, 1, 98, 25, 4, 10]), new Uint8Array([123, 37, 6, 4, 1, 27, 0, 0, 0, 0, 5, 8, 1, 7, 0, 1, 12, 10, 0, 2]), new Uint8Array([26, 14, 14, 12, 0, 24, 0, 0, 0, 0, 55, 17, 1, 9, 0, 36, 5, 7, 1, 3]), new Uint8Array([209, 5, 0, 0, 0, 27, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]), new Uint8Array([2, 5, 4, 5, 0, 121, 0, 0, 0, 0, 0, 3, 2, 4, 1, 4, 2, 2, 0, 1]), new Uint8Array([175, 5, 0, 1, 0, 48, 0, 0, 0, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0, 0]), new Uint8Array([83, 5, 2, 3, 0, 102, 0, 0, 0, 0, 1, 3, 0, 2, 0, 1, 0, 0, 0, 0]), new Uint8Array([233, 6, 0, 0, 0, 8, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0]), new Uint8Array([34, 16, 112, 21, 1, 28, 0, 0, 0, 0, 6, 8, 1, 7, 0, 3, 2, 5, 0, 2]), new Uint8Array([159, 35, 2, 2, 0, 25, 0, 0, 0, 0, 3, 6, 0, 5, 0, 1, 4, 4, 0, 1]), new Uint8Array([75, 39, 5, 7, 2, 48, 0, 0, 0, 0, 3, 11, 2, 16, 1, 4, 7, 10, 0, 2]), new Uint8Array([212, 21, 0, 1, 0, 9, 0, 0, 0, 0, 1, 2, 0, 2, 0, 0, 2, 2, 0, 0]), new Uint8Array([4, 2, 0, 0, 0, 172, 0, 0, 0, 0, 0, 1, 0, 2, 0, 0, 2, 0, 0, 0]), new Uint8Array([187, 22, 1, 1, 0, 17, 0, 0, 0, 0, 3, 6, 0, 4, 0, 1, 4, 4, 0, 1]), new Uint8Array([133, 6, 1, 2, 1, 70, 0, 0, 0, 0, 0, 2, 0, 4, 0, 3, 1, 1, 0, 0]), new Uint8Array([251, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])], [new Uint8Array([2, 3, 2, 3, 0, 2, 0, 2, 0, 0, 11, 4, 1, 4, 0, 2, 3, 2, 0, 4]), new Uint8Array([49, 46, 3, 4, 7, 31, 42, 41, 0, 0, 2, 6, 1, 7, 1, 4, 2, 4, 0, 1]), new Uint8Array([26, 25, 1, 1, 2, 10, 67, 39, 0, 0, 1, 1, 0, 14, 0, 2, 31, 26, 1, 6]), new Uint8Array([103, 46, 1, 2, 2, 10, 33, 42, 0, 0, 1, 4, 0, 3, 0, 1, 1, 3, 0, 0]), new Uint8Array([14, 31, 9, 13, 14, 54, 22, 29, 0, 0, 2, 6, 4, 18, 6, 13, 1, 5, 0, 1]), new Uint8Array([85, 39, 0, 0, 1, 9, 69, 40, 0, 0, 0, 1, 0, 3, 0, 1, 2, 3, 0, 0]), new Uint8Array([31, 28, 0, 0, 3, 14, 130, 34, 0, 0, 0, 1, 0, 3, 0, 1, 3, 3, 0, 1]), new Uint8Array([171, 25, 0, 0, 1, 5, 25, 21, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]), new Uint8Array([17, 21, 68, 29, 6, 15, 13, 22, 0, 0, 6, 12, 3, 14, 4, 10, 1, 7, 0, 3]), new Uint8Array([51, 39, 0, 1, 2, 12, 91, 44, 0, 0, 0, 2, 0, 3, 0, 1, 2, 3, 0, 1]), new Uint8Array([81, 25, 0, 0, 2, 9, 106, 26, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0]), new Uint8Array([140, 37, 0, 1, 1, 8, 24, 33, 0, 0, 1, 2, 0, 2, 0, 1, 1, 2, 0, 0]), new Uint8Array([14, 23, 1, 3, 11, 53, 90, 31, 0, 0, 0, 3, 1, 5, 2, 6, 1, 2, 0, 0]), new Uint8Array([123, 29, 0, 0, 1, 7, 57, 30, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0]), new Uint8Array([13, 14, 0, 0, 4, 20, 175, 20, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0]), new Uint8Array([202, 23, 0, 0, 1, 3, 2, 9, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0])]];
	const INVALID_REF = 42;
	class VP56Models {
		constructor() {
			this.mv_models = [new VP56MVModel(), new VP56MVModel()];
			this.mbtype_models = [[new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel()], [new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel()], [new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel(), new VP56MBTypeModel()]];
			this.coeff_models = [new VP56CoeffModel(), new VP56CoeffModel()];
			this.prob_xmitted = [new Uint8Array(20), new Uint8Array(20), new Uint8Array(20)];
			this.vp6models = new VP6Models();
		}
	}
	class MBInfo {
		constructor() {
			this.mb_type = new VPMBType(VPMBType.Intra);
			this.mv = new MV(0, 0);
		}
	}
	class FrameState {
		constructor() {
			this.mb_x = 0;
			this.mb_y = 0;
			this.plane = 0;
			this.coeff_cat = [new Uint8Array(64), new Uint8Array(64), new Uint8Array(64), new Uint8Array(64)];
			this.last_idx = new Uint32Array(4);
			this.top_ctx = 0;
			this.ctx_idx = 0;
			this.dc_quant = 0;
			this.ac_quant = 0;
			this.dc_zero_run = new Uint32Array(2);
			this.ac_zero_run = new Uint32Array(2);
		}
	}
	class VP56DCPred {
		constructor() {
			this.dc_y = new Int16Array(0);
			this.dc_u = new Int16Array(0);
			this.dc_v = new Int16Array(0);
			this.ldc_y = new Int16Array(2);
			this.ldc_u = 0;
			this.ldc_v = 0;
			this.ref_y = new Uint8Array(0);
			this.ref_c = new Uint8Array(0);
			this.ref_left = 0;
			this.y_idx = 0;
			this.c_idx = 0;
		}
		reset() {
			this.update_row();
			for (var i = 1; i < this.ref_y.length; i++) this.ref_y[i] = INVALID_REF;
			for (var i = 1; i < this.ref_c.length; i++) this.ref_c[i] = INVALID_REF;
		}
		update_row() {
			this.y_idx = 1;
			this.c_idx = 1;
			this.ldc_y = new Int16Array(2);
			this.ldc_u = 0;
			this.ldc_v = 0;
			this.ref_left = INVALID_REF;
		}
		resize(mb_w) {
			this.dc_y = new Int16Array(mb_w * 2 + 2);
			this.dc_u = new Int16Array(mb_w + 2);
			this.dc_v = new Int16Array(mb_w + 2);
			this.ref_y = new Uint8Array(mb_w * 2 + 2);
			this.ref_y.fill(INVALID_REF);
			this.ref_c = new Uint8Array(mb_w + 2);
			this.ref_c.fill(INVALID_REF);
			this.ref_c[0] = 0;
		}
		next_mb() {
			this.y_idx += 2;
			this.c_idx += 1;
		}
	}
	function rescale_mb_mode_prob(prob, total) {
		return asU8(255 * prob / (1 + total));
	}
	function map_mb_type(mbtype) {
		switch(mbtype.type) {
			case VPMBType.InterNoMV: return 0;
			case VPMBType.Intra: return 1;
			case VPMBType.InterMV: return 2;
			case VPMBType.InterNearest: return 3;
			case VPMBType.InterNear: return 4;
			case VPMBType.GoldenNoMV: return 5;
			case VPMBType.GoldenMV: return 6;
			case VPMBType.InterFourMV: return 7;
			case VPMBType.GoldenNearest: return 8;
			case VPMBType.GoldenNear: return 9;
		}
	}
	class VP56Decoder {
		constructor(version, hasAlpha, flip) {
			let vt = alloc_video_buffer(new NAVideoInfo(24, 24, false, VP_YUVA420_FORMAT), 4);
			this.version = version;
			this.has_alpha = hasAlpha;
			this.flip = flip;
			this.shuf = new VPShuffler();
			this.width = 0;
			this.height = 0;
			this.mb_w = 0;
			this.mb_h = 0;
			this.models = new VP56Models();
			this.amodels = new VP56Models();
			this.coeffs = [new Int16Array(64), new Int16Array(64), new Int16Array(64), new Int16Array(64), new Int16Array(64), new Int16Array(64)];
			this.last_mbt = new VPMBType(VPMBType.InterNoMV);
			this.loop_thr = 0;
			this.ilace_prob = 0;
			this.ilace_mb = false;
			this.mb_info = [];
			this.fstate = new FrameState();
			this.dc_pred = new VP56DCPred();
			this.last_dc = [new Int16Array(4), new Int16Array(4), new Int16Array(4)];
			this.top_ctx = [new Uint8Array(0), new Uint8Array(0), new Uint8Array(0), new Uint8Array(0)];
			this.mc_buf = vt.get_vbuf();
		}
		set_dimensions(width, height) {
			this.width = width;
			this.height = height;
			this.mb_w = (this.width + 15) >> 4;
			this.mb_h = (this.height + 15) >> 4;
			this.mb_info = [];
			for (var i = 0; i < this.mb_w * this.mb_h; i++) {
				this.mb_info.push(new MBInfo());
			}
			this.top_ctx = [new Uint8Array(this.mb_w * 2), new Uint8Array(this.mb_w), new Uint8Array(this.mb_w), new Uint8Array(this.mb_w * 2)];
		}
		init(supp, vinfo) {
			supp.pool_u8.set_dec_bufs(3 + (vinfo.get_format().has_alpha() ? 1 : 0));
			supp.pool_u8.prealloc_video(new NAVideoInfo(vinfo.get_width(), vinfo.get_height(), false, vinfo.get_format()), 4);
			this.set_dimensions(vinfo.get_width(), vinfo.get_height());
			this.dc_pred.resize(this.mb_w);
		}
		decode_frame(supp, src, br) {
			let aoffset;
			let bc;
			if (this.has_alpha) {
				validate(src.length >= 7);
				aoffset = ((src[0]) << 16) | ((src[1]) << 8) | (src[2]);
				validate((aoffset > 0) && (aoffset < src.length - 3));
				bc = new BoolCoder(src.subarray(3));
			} else {
				validate(src.length >= 4);
				aoffset = src.length;
				bc = new BoolCoder(src);
			}
			let hdr = br.parseHeader(bc);
			validate((hdr.offset) < aoffset);
			if (hdr.mb_w != 0 && (hdr.mb_w != this.mb_w || hdr.mb_h != this.mb_h)) {
				this.set_dimensions(hdr.mb_w * 16, hdr.mb_h * 16);
			}
			let fmt = this.has_alpha ? VP_YUVA420_FORMAT : YUV420_FORMAT;
			let vinfo = new NAVideoInfo(this.width, this.height, this.flip, fmt);
			let ret = supp.pool_u8.get_free();
			if (ret === null) throw new Error("DecoderError::AllocError");
			let buf = ret;
			if (!buf.get_info().eq(vinfo)) {
				this.shuf.clear();
				supp.pool_u8.reset();
				supp.pool_u8.prealloc_video(vinfo, 4);
				let ret = supp.pool_u8.get_free();
				if (ret === null) throw new Error("DecoderError::AllocError");
				buf = ret;
			}
			let dframe = NASimpleVideoFrame.from_video_buf(buf);
			if (hdr.is_intra) {
				this.shuf.clear();
			} else {
				if (!this.shuf.has_refs()) {
					throw new Error("DecoderError::MissingReference");
				}
			}
			let psrc = src.subarray(this.has_alpha ? 3 : 0);
			this.decode_planes(br, dframe, bc, hdr, psrc, false);
			if (this.has_alpha) {
				let asrc = src.subarray(aoffset + 3);
				let _bc = new BoolCoder(asrc);
				let ahdr = br.parseHeader(_bc);
				validate(ahdr.mb_w == hdr.mb_w && ahdr.mb_h == hdr.mb_h);
				var models = this.models;
				this.models = this.amodels;
				this.decode_planes(br, dframe, _bc, ahdr, asrc, true);
				this.models = models;
				if (hdr.is_golden && ahdr.is_golden) {
					this.shuf.add_golden_frame(buf.cloned());
				} else if (hdr.is_golden && !ahdr.is_golden) {
					let cur_golden = this.shuf.get_golden();
					let off = cur_golden.get_offset(3);
					let stride = cur_golden.get_stride(3);
					let new_golden = supp.pool_u8.get_copy(buf);
					let dst = new_golden.get_data();
					let _src = cur_golden.get_data();
					dst.set(_src.subarray(off, off + (stride * this.mb_h * 16)), off);
					this.shuf.add_golden_frame(new_golden);
				} else if (!hdr.is_golden && ahdr.is_golden) {
					let cur_golden = this.shuf.get_golden();
					let off = cur_golden.get_offset(3);
					let stride = cur_golden.get_stride(3);
					let new_golden = supp.pool_u8.get_copy(cur_golden);
					let dst = new_golden.get_data();
					let _src = buf.get_data();
					dst.set(_src.subarray(off, off + (stride * this.mb_h * 16)), off);
					this.shuf.add_golden_frame(new_golden);
				}
			}
			if (hdr.is_golden && !this.has_alpha) this.shuf.add_golden_frame(buf.cloned());
			this.shuf.add_frame(buf.cloned());
			return [new NABufferType(NABufferType.Video, buf), hdr.is_intra];
		}
		reset_mbtype_models() {
			const DEFAULT_XMITTED_PROBS = [new Uint8Array([42, 69, 2, 1, 7, 1, 42, 44, 22, 6, 3, 1, 2, 0, 5, 1, 1, 0, 0, 0]), new Uint8Array([8, 229, 1, 1, 8, 0, 0, 0, 0, 0, 2, 1, 1, 0, 0, 0, 1, 1, 0, 0]), new Uint8Array([35, 122, 1, 1, 6, 1, 34, 46, 0, 0, 2, 1, 1, 0, 1, 0, 1, 1, 0, 0])];
			this.models.prob_xmitted[0].set(DEFAULT_XMITTED_PROBS[0], 0);
			this.models.prob_xmitted[1].set(DEFAULT_XMITTED_PROBS[1], 0);
			this.models.prob_xmitted[2].set(DEFAULT_XMITTED_PROBS[2], 0);
		}
		decode_planes(br, dframe, bc, hdr, src, alpha) {
			let cr;
			if (hdr.multistream) {
				let off = +hdr.offset.toString();
				if (!hdr.use_huffman) {
					let bc2 = new BoolCoder(src.subarray(off));
					cr = new CoeffReader(CoeffReader.Bool, bc2);
				} else {
					throw new Error("UnimplementedDecoding use_huffman");
				}
			} else {
				cr = new CoeffReader(CoeffReader.None);
			}
			if (hdr.is_intra) {
				br.reset_models(this.models);
				this.reset_mbtype_models();
			} else {
				this.decode_mode_prob_models(bc);
				br.decode_mv_models(bc, this.models.mv_models);
			}
			br.decode_coeff_models(bc, this.models, hdr.is_intra);
			if (hdr.use_huffman) {
				throw new Error("UnimplementedDecoding use_huffman");
			}
			if (hdr.interlaced) {
				this.ilace_prob = asU8(bc.read_bits(8));
			}
			this.fstate = new FrameState();
			this.fstate.dc_quant = asI16(VP56_DC_QUANTS[hdr.quant] * 4);
			this.fstate.ac_quant = asI16(VP56_AC_QUANTS[hdr.quant] * 4);
			this.loop_thr = asI16(VP56_FILTER_LIMITS[hdr.quant]);
			this.last_mbt = new VPMBType(VPMBType.InterNoMV);
			for (var i = 0; i < this.top_ctx.length; i++) {
				var vec = this.top_ctx[i];
				vec.fill(0);
			}
			this.last_dc = [new Int16Array(4), new Int16Array(4), new Int16Array(4)];
			this.last_dc[0][1] = 0x80;
			this.last_dc[0][2] = 0x80;
			this.dc_pred.reset();
			this.ilace_mb = false;
			for (var mb_y = 0; mb_y < this.mb_h; mb_y++) {
				this.fstate.mb_y = mb_y;
				this.fstate.coeff_cat[0].fill(0);
				this.fstate.coeff_cat[1].fill(0);
				this.fstate.coeff_cat[2].fill(0);
				this.fstate.coeff_cat[3].fill(0);
				this.fstate.last_idx.fill(24);
				for (var mb_x = 0; mb_x < this.mb_w; mb_x++) {
					this.fstate.mb_x = mb_x;
					this.decode_mb(dframe, bc, cr, br, hdr, alpha);
					this.dc_pred.next_mb();
				}
				this.dc_pred.update_row();
			}
		}
		decode_mode_prob_models(bc) {
			for (let ctx = 0; ctx < 3; ctx++) {
				if (bc.read_prob(174)) {
					let idx = bc.read_bits(4);
					for (let i = 0; i < 20; i++) {
						this.models.prob_xmitted[ctx][i ^ 1] = VP56_MODE_VQ[ctx][idx][i];
					}
				}
				if (bc.read_prob(254)) {
					for (let set = 0; set < 20; set++) {
						if (bc.read_prob(205)) {
							let sign = bc.read_bool();
							let diff = (bc.read_prob(171) ? (bc.read_prob(199) ? bc.read_bits(7) : (bc.read_prob(140) ? 3 : (bc.read_prob(125) ? 4 : (bc.read_prob(104) ? 5 : 6)))) : (bc.read_prob(83) ? 1 : 2)) * 4;
							validate(diff < 256);
							let _diff = asU8(diff);
							if (!sign) {
								validate(this.models.prob_xmitted[ctx][set ^ 1] <= 255 - _diff);
								this.models.prob_xmitted[ctx][set ^ 1] += _diff;
							} else {
								validate(this.models.prob_xmitted[ctx][set ^ 1] >= _diff);
								this.models.prob_xmitted[ctx][set ^ 1] -= _diff;
							}
						}
					}
				}
			}
			for (let ctx = 0; ctx < 3; ctx++) {
				let prob_xmitted = this.models.prob_xmitted[ctx];
				for (let mode = 0; mode < 10; mode++) {
					let mdl = this.models.mbtype_models[ctx][mode];
					let cnt = new Uint32Array(10);
					let total = 0;
					for (let i = 0; i < 10; i++) {
						if (i == mode) continue;
						cnt[i] = 100 * asU32(prob_xmitted[i * 2]);
						total += cnt[i];
					}
					let sum = asU32(prob_xmitted[mode * 2]) + asU32(prob_xmitted[mode * 2 + 1]);
					mdl.probs[9] = 255 - rescale_mb_mode_prob(asU32(prob_xmitted[mode * 2 + 1]), sum);
					let inter_mv0_weight = cnt[0] + cnt[2];
					let inter_mv1_weight = cnt[3] + cnt[4];
					let gold_mv0_weight = cnt[5] + cnt[6];
					let gold_mv1_weight = cnt[8] + cnt[9];
					let mix_weight = cnt[1] + cnt[7];
					mdl.probs[0] = 1 + rescale_mb_mode_prob(inter_mv0_weight + inter_mv1_weight, total);
					mdl.probs[1] = 1 + rescale_mb_mode_prob(inter_mv0_weight, inter_mv0_weight + inter_mv1_weight);
					mdl.probs[2] = 1 + rescale_mb_mode_prob(mix_weight, mix_weight + gold_mv0_weight + gold_mv1_weight);
					mdl.probs[3] = 1 + rescale_mb_mode_prob(cnt[0], inter_mv0_weight);
					mdl.probs[4] = 1 + rescale_mb_mode_prob(cnt[3], inter_mv1_weight);
					mdl.probs[5] = 1 + rescale_mb_mode_prob(cnt[1], mix_weight);
					mdl.probs[6] = 1 + rescale_mb_mode_prob(gold_mv0_weight, gold_mv0_weight + gold_mv1_weight);
					mdl.probs[7] = 1 + rescale_mb_mode_prob(cnt[5], gold_mv0_weight);
					mdl.probs[8] = 1 + rescale_mb_mode_prob(cnt[8], gold_mv1_weight);
				}
			}
		}
		find_mv_pred(ref_id) {
			const CAND_POS = [new Int8Array([-1, 0]), new Int8Array([0, -1]), new Int8Array([-1, -1]), new Int8Array([-1, 1]), new Int8Array([-2, 0]), new Int8Array([0, -2]), new Int8Array([-1, -2]), new Int8Array([-2, -1]), new Int8Array([-2, 1]), new Int8Array([-1, 2]), new Int8Array([-2, -2]), new Int8Array([-2, 2])];
			let nearest_mv = ZERO_MV;
			let near_mv = ZERO_MV;
			let pred_mv = ZERO_MV;
			let num_mv = 0;
			for (let i = 0; i < CAND_POS.length; i++) {
				let [yoff, xoff] = CAND_POS[i];
				let cx = (this.fstate.mb_x) + xoff;
				let cy = (this.fstate.mb_y) + yoff;
				if ((cx < 0) || (cy < 0)) continue;
				if ((cx >= this.mb_w) || (cy >= this.mb_h)) continue;
				let mb_pos = cx + cy * this.mb_w;
				let mv = this.mb_info[mb_pos].mv;
				if ((this.mb_info[mb_pos].mb_type.get_ref_id() != ref_id) || mv.eq(ZERO_MV)) continue;
				if (num_mv == 0) {
					nearest_mv = mv;
					num_mv += 1;
					if ((this.version > 5) && (i < 2)) pred_mv = mv;
				} else if (!(mv.eq(nearest_mv))) {
					near_mv = mv;
					num_mv += 1;
					break;
				}
			}
			return [num_mv, nearest_mv, near_mv, pred_mv];
		}
		decode_mb_type(bc, ctx) {
			let probs = this.models.mbtype_models[ctx][map_mb_type(this.last_mbt)].probs;
			if (!bc.read_prob(probs[9])) this.last_mbt = bc.read_prob(probs[0]) ? (bc.read_prob(probs[2]) ? (bc.read_prob(probs[6]) ? (bc.read_prob(probs[8]) ? new VPMBType(VPMBType.GoldenNear) : new VPMBType(VPMBType.GoldenNearest)) : (bc.read_prob(probs[7]) ? new VPMBType(VPMBType.GoldenMV) : new VPMBType(VPMBType.GoldenNoMV))) : (bc.read_prob(probs[5]) ? new VPMBType(VPMBType.InterFourMV) : new VPMBType(VPMBType.Intra))) : (bc.read_prob(probs[1]) ? (bc.read_prob(probs[4]) ? new VPMBType(VPMBType.InterNear) : new VPMBType(VPMBType.InterNearest)) : (bc.read_prob(probs[3]) ? new VPMBType(VPMBType.InterMV) : new VPMBType(VPMBType.InterNoMV)));
			return this.last_mbt;
		}
		decode_mb(frm, bc, cr, br, hdr, alpha) {
			const FOURMV_SUB_TYPE = [new VPMBType(VPMBType.InterNoMV), new VPMBType(VPMBType.InterMV), new VPMBType(VPMBType.InterNearest), new VPMBType(VPMBType.InterNear)];
			let mb_x = this.fstate.mb_x;
			let mb_y = this.fstate.mb_y;
			this.coeffs[0].fill(0);
			this.coeffs[1].fill(0);
			this.coeffs[2].fill(0);
			this.coeffs[3].fill(0);
			this.coeffs[4].fill(0);
			this.coeffs[5].fill(0);
			let mb_pos = mb_x + mb_y * this.mb_w;
			let four_mv = [ZERO_MV, ZERO_MV, ZERO_MV, ZERO_MV];
			let four_mbt = [new VPMBType(VPMBType.Intra), new VPMBType(VPMBType.Intra), new VPMBType(VPMBType.Intra), new VPMBType(VPMBType.Intra)];
			if (hdr.interlaced) {
				let iprob = this.ilace_prob;
				let prob;
				if (mb_x == 0) {
					prob = iprob;
				} else if (!this.ilace_mb) {
					prob = asU8(iprob + asU8(((256 - asU16(iprob)) >> 1)));
				} else {
					prob = asU8(iprob - (iprob >> 1));
				}
				this.ilace_mb = bc.read_prob(prob);
			}
			let num_mv;
			let nearest_mv;
			let near_mv;
			let pred_mv;
			if (hdr.is_intra) {
				num_mv = 0;
				nearest_mv = ZERO_MV;
				near_mv = ZERO_MV;
				pred_mv = ZERO_MV;
			} else {
				var ggdfd = this.find_mv_pred(VP_REF_INTER);
				num_mv = ggdfd[0];
				nearest_mv = ggdfd[1];
				near_mv = ggdfd[2];
				pred_mv = ggdfd[3];
			}
			let mb_type;
			if (hdr.is_intra) mb_type = new VPMBType(VPMBType.Intra);
			else mb_type = this.decode_mb_type(bc, (num_mv + 1) % 3);
			this.mb_info[mb_pos].mb_type = mb_type;
			if (mb_type.get_ref_id() != VP_REF_GOLDEN) {
				switch (mb_type.type) {
					case VPMBType.Intra:
					case VPMBType.InterNoMV:
						this.mb_info[mb_pos].mv = ZERO_MV;
						break;
					case VPMBType.InterMV:
						let diff_mv = this.decode_mv(bc, br);
						this.mb_info[mb_pos].mv = pred_mv.add(diff_mv);
						break;
					case VPMBType.InterNearest:
						this.mb_info[mb_pos].mv = nearest_mv;
						break;
					case VPMBType.InterNear:
						this.mb_info[mb_pos].mv = near_mv;
						break;
					case VPMBType.InterFourMV:
						for (var i = 0; i < 4; i++) {
							four_mbt[i] = FOURMV_SUB_TYPE[bc.read_bits(2)];
						}
						for (var i = 0; i < 4; i++) {
							switch (four_mbt[i].type) {
								case VPMBType.InterNoMV:
									break;
								case VPMBType.InterMV:
									let diff_mv = this.decode_mv(bc, br);
									four_mv[i] = pred_mv.add(diff_mv);
									break;
								case VPMBType.InterNearest:
									four_mv[i] = nearest_mv;
									break;
								case VPMBType.InterNear:
									four_mv[i] = near_mv;
									break;
								default:
									throw new Error("unreachable");
							}
						}
						this.mb_info[mb_pos].mv = four_mv[3];
						break;
					default:
						throw new Error("unreachable");
				}
			} else {
				let [_num_mv, nearest_mv, near_mv, pred_mv] = this.find_mv_pred(VP_REF_GOLDEN);
				switch (mb_type.type) {
					case VPMBType.GoldenNoMV:
						this.mb_info[mb_pos].mv = ZERO_MV;
						break;
					case VPMBType.GoldenMV:
						let diff_mv = this.decode_mv(bc, br);
						this.mb_info[mb_pos].mv = pred_mv.add(diff_mv);
						break;
					case VPMBType.GoldenNearest:
						this.mb_info[mb_pos].mv = nearest_mv;
						break;
					case VPMBType.GoldenNear:
						this.mb_info[mb_pos].mv = near_mv;
						break;
				}
			}
			if (!mb_type.is_intra() && (mb_type.type != VPMBType.InterFourMV)) {
				this.do_mc(br, frm, mb_type, this.mb_info[mb_pos].mv, alpha);
			} else if (mb_type.type == VPMBType.InterFourMV) {
				this.do_fourmv(br, frm, four_mv, alpha);
			}
			for (var blk_no = 0; blk_no < 4; blk_no++) {
				this.fstate.plane = (!alpha ? 0 : 3);
				this.fstate.ctx_idx = blk_no >> 1;
				this.fstate.top_ctx = this.top_ctx[this.fstate.plane][mb_x * 2 + (blk_no & 1)];
				switch (cr.type) {
					case CoeffReader.None:
						br.decode_block(bc, this.coeffs[blk_no], this.models.coeff_models[0], this.models.vp6models, this.fstate);
						break;
					case CoeffReader.Bool:
						br.decode_block(cr.value, this.coeffs[blk_no], this.models.coeff_models[0], this.models.vp6models, this.fstate);
						break;
				}
				this.top_ctx[this.fstate.plane][mb_x * 2 + (blk_no & 1)] = this.fstate.top_ctx;
				this.predict_dc(mb_type, mb_pos, blk_no, alpha);
				let bx = mb_x * 2 + (blk_no & 1);
				let by = mb_y * 2 + (blk_no >> 1);
				let has_ac = (this.fstate.last_idx[this.fstate.ctx_idx] > 0);
				if (mb_type.is_intra()) {
					if (!this.ilace_mb) {
						if (has_ac) {
							vp_put_block(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
						} else {
							vp_put_block_dc(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
						}
					} else {
						vp_put_block_ilace(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
					}
				} else {
					if (!this.ilace_mb) {
						if (has_ac) {
							vp_add_block(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
						} else {
							vp_add_block_dc(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
						}
					} else {
						vp_add_block_ilace(this.coeffs[blk_no], bx, by, this.fstate.plane, frm);
					}
				}
			}
			for (var blk_no = 4; blk_no < 6; blk_no++) {
				this.fstate.plane = blk_no - 3;
				this.fstate.ctx_idx = blk_no - 2;
				this.fstate.top_ctx = this.top_ctx[this.fstate.plane][mb_x];
				switch (cr.type) {
					case CoeffReader.None:
						br.decode_block(bc, this.coeffs[blk_no], this.models.coeff_models[1], this.models.vp6models, this.fstate);
						break;
					case CoeffReader.Bool:
						br.decode_block(cr.value, this.coeffs[blk_no], this.models.coeff_models[1], this.models.vp6models, this.fstate);
						break;
				}
				this.top_ctx[this.fstate.plane][mb_x] = this.fstate.top_ctx;
				this.predict_dc(mb_type, mb_pos, blk_no, alpha);
				if (!alpha) {
					let has_ac = this.fstate.last_idx[this.fstate.ctx_idx] > 0;
					if (mb_type.is_intra()) {
						if (has_ac) {
							vp_put_block(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
						} else {
							vp_put_block_dc(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
						}
					} else {
						if (has_ac) {
							vp_add_block(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
						} else {
							vp_add_block_dc(this.coeffs[blk_no], mb_x, mb_y, this.fstate.plane, frm);
						}
					}
				}
			}
		}
		do_mc(br, frm, mb_type, mv, alpha) {
			let x = this.fstate.mb_x * 16;
			let y = this.fstate.mb_y * 16;
			let plane = alpha ? 3 : 0;
			let src;
			if (mb_type.get_ref_id() == VP_REF_INTER) src = this.shuf.get_last();
			else src = this.shuf.get_golden();
			br.mc_block(frm, this.mc_buf, src, plane, x + 0, y + 0, mv, this.loop_thr);
			br.mc_block(frm, this.mc_buf, src, plane, x + 8, y + 0, mv, this.loop_thr);
			br.mc_block(frm, this.mc_buf, src, plane, x + 0, y + 8, mv, this.loop_thr);
			br.mc_block(frm, this.mc_buf, src, plane, x + 8, y + 8, mv, this.loop_thr);
			if (!alpha) {
				let x = this.fstate.mb_x * 8;
				let y = this.fstate.mb_y * 8;
				br.mc_block(frm, this.mc_buf, src, 1, x, y, mv, this.loop_thr);
				br.mc_block(frm, this.mc_buf, src, 2, x, y, mv, this.loop_thr);
			}
		}
		do_fourmv(br, frm, mvs, alpha) {
			let x = this.fstate.mb_x * 16;
			let y = this.fstate.mb_y * 16;
			let plane = alpha ? 3 : 0;
			let src = this.shuf.get_last();
			for (let blk_no = 0; blk_no < 4; blk_no++) {
				br.mc_block(frm, this.mc_buf, src, plane, x + (blk_no & 1) * 8, y + (blk_no & 2) * 4, mvs[blk_no], this.loop_thr);
			}
			if (!alpha) {
				let x = this.fstate.mb_x * 8;
				let y = this.fstate.mb_y * 8;
				let sum = mvs[0].add(mvs[1].add(mvs[2].add(mvs[3])));
				let mv = new MV(asI16(sum.x / 4), asI16(sum.y / 4));
				br.mc_block(frm, this.mc_buf, src, 1, x, y, mv, this.loop_thr);
				br.mc_block(frm, this.mc_buf, src, 2, x, y, mv, this.loop_thr);
			}
		}
		decode_mv(bc, br) {
			let x = br.decode_mv(bc, this.models.mv_models[0]);
			let y = br.decode_mv(bc, this.models.mv_models[1]);
			return new MV(x, y);
		}
		predict_dc(mb_type, _mb_pos, blk_no, _alpha) {
			let is_luma = blk_no < 4;
			let plane;
			let dcs;
			switch (blk_no) {
				case 4:
					plane = 1;
					dcs = this.dc_pred.dc_u;
					break;
				case 5:
					plane = 2;
					dcs = this.dc_pred.dc_v;
					break;
				default:
					plane = 0;
					dcs = this.dc_pred.dc_y;
			}
			let dc_ref;
			let dc_idx;
			if (is_luma) {
				dc_ref = this.dc_pred.ref_y;
				dc_idx = this.dc_pred.y_idx + (blk_no & 1);
			} else {
				dc_ref = this.dc_pred.ref_c;
				dc_idx = this.dc_pred.c_idx;
			}
			let ref_id = mb_type.get_ref_id();
			let dc_pred = 0;
			let count = 0;
			let has_left_blk = is_luma && ((blk_no & 1) == 1);
			if (has_left_blk || this.dc_pred.ref_left == ref_id) {
				var _ = 0;
				switch (blk_no) {
					case 0:
					case 1:
						_ = this.dc_pred.ldc_y[0];
						break;
					case 2:
					case 3:
						_ = this.dc_pred.ldc_y[1];
						break;
					case 4:
						_ = this.dc_pred.ldc_u;
						break;
					default:
						_ = this.dc_pred.ldc_v;
				}
				dc_pred += _;
				count += 1;
			}
			if (dc_ref[dc_idx] == ref_id) {
				dc_pred += dcs[dc_idx];
				count += 1;
			}
			if (this.version == 5) {
				if ((count < 2) && (dc_ref[dc_idx - 1] == ref_id)) {
					dc_pred += dcs[dc_idx - 1];
					count += 1;
				}
				if ((count < 2) && (dc_ref[dc_idx + 1] == ref_id)) {
					dc_pred += dcs[dc_idx + 1];
					count += 1;
				}
			}
			if (count == 0) {
				dc_pred = this.last_dc[ref_id][plane];
			} else if (count == 2) {
				dc_pred /= 2;
				dc_pred = asI16(dc_pred);
			}
			this.coeffs[blk_no][0] += dc_pred;
			let dc = this.coeffs[blk_no][0];
			if (blk_no != 4) {
				dc_ref[dc_idx] = ref_id;
			}
			switch (blk_no) {
				case 0:
				case 1:
					this.dc_pred.ldc_y[0] = dc;
					break;
				case 2:
				case 3:
					this.dc_pred.ldc_y[1] = dc;
					break;
				case 4:
					this.dc_pred.ldc_u = dc;
					break;
				default:
					this.dc_pred.ldc_v = dc;
					this.dc_pred.ref_left = ref_id;
			}
			dcs[dc_idx] = dc;
			this.last_dc[ref_id][plane] = dc;
			this.coeffs[blk_no][0] = asI16(this.coeffs[blk_no][0] * this.fstate.dc_quant); 
		}
	}
	const TOKEN_LARGE = 5;
	const TOKEN_EOB = 42;
	function update_scan(model) {
		let idx = 1;
		for (var band = 0; band < 16; band++) {
			for (var i = 1; i < 64; i++) {
				if (model.scan_order[i] == band) {
					model.scan[idx] = i;
					idx += 1;
				}
			}
		}
		for (var i = 1; i < 64; i++) {
			model.zigzag[i] = ZIGZAG[model.scan[i]];
		}
	}
	function reset_scan(model, interlaced) {
		if (!interlaced) {
			model.scan_order.set(VP6_DEFAULT_SCAN_ORDER, 0);
		} else {
			model.scan_order.set(VP6_INTERLACED_SCAN_ORDER, 0);
		}
		for (var i = 0; i < 64; i++) {
			model.scan[i] = i;
		}
		model.zigzag.set(ZIGZAG, 0);
	}
	function expand_token_bc(bc, val_probs, token, version) {
		let sign = false;
		let level;
		if (token < TOKEN_LARGE) {
			if (token != 0) {
				sign = bc.read_bool();
			}
			level = asI16(token);
		} else {
			let cat = bc.read_prob(val_probs[6]) ? (bc.read_prob(val_probs[8]) ? (bc.read_prob(val_probs[10]) ? 5 : 4) : (bc.read_prob(val_probs[9]) ? 3 : 2)) : (bc.read_prob(val_probs[7]) ? 1 : 0);
			if (version == 5) {
				sign = bc.read_bool();
			}
			let add = 0;
			let add_probs = VP56_COEF_ADD_PROBS[cat];
			for (var i = 0; i < add_probs.length; i++) {
				var prob = add_probs[i];
				if (prob == 128) {
					break;
				}
				add = (add << 1) | asI16(bc.read_prob(prob));
			}
			if (version != 5) {
				sign = bc.read_bool();
			}
			level = asI16(VP56_COEF_BASE[cat] + asI16(add));
		}
		if (!sign) {
			return asI16(level);
		} else {
			return asI16(-level);
		}
	}
	function decode_token_bc(bc, probs, prob34, is_dc, has_nnz) {
		if (has_nnz && !bc.read_prob(probs[0])) {
			if (is_dc || bc.read_prob(probs[1])) {
				return 0;
			} else {
				return TOKEN_EOB;
			}
		} else {
			return asU8(bc.read_prob(probs[2]) ? (bc.read_prob(probs[3]) ? TOKEN_LARGE : (bc.read_prob(probs[4]) ? (bc.read_prob(prob34) ? 4 : 3) : 2)) : 1);
		}
	}
	function decode_zero_run_bc(bc, probs) {
		let val = bc.read_prob(probs[0]) ? (bc.read_prob(probs[4]) ? 42 : (bc.read_prob(probs[5]) ? (bc.read_prob(probs[7]) ? 7 : 6) : (bc.read_prob(probs[6]) ? 5 : 4))) : (bc.read_prob(probs[1]) ? (bc.read_prob(probs[3]) ? 3 : 2) : (bc.read_prob(probs[2]) ? 1 : 0));
		if (val != 42) {
			return val;
		} else {
			let nval = 8;
			for (var i = 0; i < 6; i++) {
				nval += (bc.read_prob(probs[i + 8])) << i;
			}
			return nval;
		}
	}
	function get_block(dst, dstride, src, comp, dx, dy, mv_x, mv_y) {
		let [w, h] = src.get_dimensions(comp);
		let sx = dx + mv_x;
		let sy = dy + mv_y;
		if ((sx - 2 < 0) || (sx + 8 + 2 > (w)) || (sy - 2 < 0) || (sy + 8 + 2 > (h))) {
			edge_emu(src, sx - 2, sy - 2, 8 + 2 + 2, 8 + 2 + 2, dst, dstride, comp, 0);
		} else {
			let sstride = src.get_stride(comp);
			let soff    = src.get_offset(comp);
			let sdta    = src.get_data();
			let sbuf = sdta;
			let saddr = soff + ((sx - 2)) + ((sy - 2)) * sstride;
			var _t = 12;
			let a = 0;
			let b = 0;
			while(_t--) {
				dst[a + 0] = sbuf[(saddr + b) + 0];
				dst[a + 1] = sbuf[(saddr + b) + 1];
				dst[a + 2] = sbuf[(saddr + b) + 2];
				dst[a + 3] = sbuf[(saddr + b) + 3];
				dst[a + 4] = sbuf[(saddr + b) + 4];
				dst[a + 5] = sbuf[(saddr + b) + 5];
				dst[a + 6] = sbuf[(saddr + b) + 6];
				dst[a + 7] = sbuf[(saddr + b) + 7];
				dst[a + 8] = sbuf[(saddr + b) + 8];
				dst[a + 9] = sbuf[(saddr + b) + 9];
				dst[a + 10] = sbuf[(saddr + b) + 10];
				dst[a + 11] = sbuf[(saddr + b) + 11];
				a += dstride;
				b += sstride;
			}
		}
	}
	function calc_variance(var_off, src, stride) {
		let sum = 0;
		let ssum = 0;
		let j = 0;
		for (let _ = 0; _ < 4; _++) {
			for (let a = 0; a < 4; a++) {
				let el = src[(var_off + j) + (a * 2)];
				let pix = asU32(el);
				sum += pix;
				ssum += pix * pix;
			}
			j += stride * 2;
		}
		return asU16((ssum * 16 - sum * sum) >> 8);
	}
	function mc_filter_bilinear(a, b, c) {
		return asU8((asU16(a) * (8 - c) + asU16(b) * c + 4) >> 3);
	}
	function mc_bilinear(dst_offest, dst, dstride, src, soff, sstride, mx, my) {
		if (my == 0) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bilinear(src[soff + i], src[soff + i + 1], mx);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else if (mx == 0) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bilinear(src[soff + i], src[soff + i + sstride], my);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else {
			let tmp = new Uint8Array(8);
			for (let i = 0; i < 8; i++) {
				tmp[i] = mc_filter_bilinear(src[soff + i], src[soff + i + 1], mx);
			}
			soff += sstride;
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					let cur = mc_filter_bilinear(src[soff + i], src[soff + i + 1], mx);
					dst[(dst_offest + dline_offest) + i] = mc_filter_bilinear(tmp[i], cur, my);
					tmp[i] = cur;
				}
				soff += sstride;
				dline_offest += dstride;
			}
		}
	}
	function mc_filter_bicubic($src, $off, $step, $coeffs) {
		return (Math.max(Math.min((($src[$off - $step] * $coeffs[0] + $src[$off] * $coeffs[1] + $src[$off + $step] * $coeffs[2] + $src[$off + $step * 2] * $coeffs[3] + 64) >> 7), 255), 0)) | 0;
	}
	function mc_bicubic(dst_offest, dst, dstride, src, soff, sstride, coeffs_w, coeffs_h) {
		if (coeffs_h[1] == 128) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bicubic(src, soff + i, 1, coeffs_w);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else if (coeffs_w[1] == 128) {
			var dline_offest = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + dline_offest) + i] = mc_filter_bicubic(src, soff + i, sstride, coeffs_h);
				}
				soff += sstride;
				dline_offest += dstride;
			}
		} else {
			let buf = new Uint8Array(16 * 11);
			let a = 0;
			soff -= sstride;
			for (let _ = 0; _ < 11; _++) {
				for (let i = 0; i < 8; i++) {
					buf[a + i] = mc_filter_bicubic(src, soff + i, 1, coeffs_w);
				}
				soff += sstride;
				a += 16;
			}
			let _soff = 16;
			a = 0;
			for (let _ = 0; _ < 8; _++) {
				for (let i = 0; i < 8; i++) {
					dst[(dst_offest + a) + i] = mc_filter_bicubic(buf, _soff + i, 16, coeffs_h);
				}
				_soff += 16;
				a += dstride;
			}
		}
	}
	class VP6BR {
		constructor() {
			this.vpversion = 0;
			this.profile = 0;
			this.interlaced = false;
			this.do_pm = false;
			this.loop_mode = 0;
			this.autosel_pm = false;
			this.var_thresh = 0;
			this.mv_thresh = 0;
			this.bicubic = false;
			this.filter_alpha = 0;
		}
		parseHeader(bc) {
			let hdr = new VP56Header();
			let src = bc.src;
			let br = new Bits(src);
			hdr.is_intra = !br.read_bool();
			hdr.is_golden = hdr.is_intra;
			hdr.quant = br.read(6);
			hdr.multistream = br.read_bool();
			if (hdr.is_intra) {
				hdr.version = br.read(5);
				validate((hdr.version >= VERSION_VP60) && (hdr.version <= VERSION_VP62));
				hdr.profile = br.read(2);
				validate((hdr.profile == VP6_SIMPLE_PROFILE) || (hdr.profile == VP6_ADVANCED_PROFILE));
				hdr.interlaced = br.read_bool();
			} else {
				hdr.version = this.vpversion;
				hdr.profile = this.profile;
				hdr.interlaced = this.interlaced;
			}
			if (hdr.multistream || (hdr.profile == VP6_SIMPLE_PROFILE)) {
				hdr.offset = br.read(16);
				validate(hdr.offset > (hdr.is_intra ? 6 : 2));
				hdr.multistream = true;
			}
			let bytes = br.tell() >> 3;
			bc.skip_bytes(bytes);
			this.loop_mode = 0;
			if (hdr.is_intra) {
				hdr.mb_h = asU8(bc.read_bits(8));
				hdr.mb_w = asU8(bc.read_bits(8));
				hdr.disp_h = asU8(bc.read_bits(8));
				hdr.disp_w = asU8(bc.read_bits(8));
				validate((hdr.mb_h > 0) && (hdr.mb_w > 0));
				hdr.scale = bc.read_bits(2);
			} else {
				hdr.is_golden = bc.read_bool();
				if (hdr.profile == VP6_ADVANCED_PROFILE) {
					this.loop_mode = +bc.read_bool();
					if (this.loop_mode != 0) {
						this.loop_mode += +bc.read_bool();
						validate(this.loop_mode <= 1);
					}
					if (hdr.version == VERSION_VP62) {
						this.do_pm = bc.read_bool();
					}
				}
			}
			if ((hdr.profile == VP6_ADVANCED_PROFILE) && (hdr.is_intra || this.do_pm)) {
				this.autosel_pm = bc.read_bool();
				if (this.autosel_pm) {
					this.var_thresh = bc.read_bits(5);
					if (hdr.version != VERSION_VP62) {
						this.var_thresh <<= 5;
					}
					this.mv_thresh = bc.read_bits(3);
				} else {
					this.bicubic = bc.read_bool();
				}
				if (hdr.version == VERSION_VP62) {
					this.filter_alpha = bc.read_bits(4);
				} else {
					this.filter_alpha = 16;
				}
			}
			hdr.use_huffman = bc.read_bool();
			this.vpversion = hdr.version;
			this.profile = hdr.profile;
			this.interlaced = hdr.interlaced;
			return hdr;
		}
		decode_mv(bc, model) {
			let val;
			if (!bc.read_prob(model.nz_prob)) {
				val = bc.read_prob(model.tree_probs[0]) ? (bc.read_prob(model.tree_probs[4]) ? (bc.read_prob(model.tree_probs[6]) ? 7 : 6) : (bc.read_prob(model.tree_probs[5]) ? 5 : 4)) : (bc.read_prob(model.tree_probs[1]) ? (bc.read_prob(model.tree_probs[3]) ? 3 : 2) : (bc.read_prob(model.tree_probs[2]) ? 1 : 0));
			} else {
				let raw = 0;
				for (var i = 0; i < LONG_VECTOR_ORDER.length; i++) {
					var ord = LONG_VECTOR_ORDER[i];
					raw |= asI16(bc.read_prob(model.raw_probs[ord])) << ord;
				}
				if ((raw & 0xF0) != 0) {
					raw |= asI16(bc.read_prob(model.raw_probs[3])) << 3;
				} else {
					raw |= 1 << 3;
				}
				val = asI16(raw);
			}
			if ((val != 0) && bc.read_prob(model.sign_prob)) {
				return -val;
			} else {
				return val;
			}
		}
		reset_models(models) {
			for (var i = 0; i < models.mv_models.length; i++) {
				var mdl = models.mv_models[i];
				mdl.nz_prob = NZ_PROBS[i];
				mdl.sign_prob = 128;
				mdl.raw_probs.set(RAW_PROBS[i], 0);
				mdl.tree_probs.set(TREE_PROBS[i], 0);
			}
			models.vp6models.zero_run_probs[0].set(ZERO_RUN_PROBS[0], 0);
			models.vp6models.zero_run_probs[1].set(ZERO_RUN_PROBS[1], 0);
			reset_scan(models.vp6models, this.interlaced);
		}
		decode_mv_models(bc, models) {
			for (let comp = 0; comp < 2; comp++) {
				if (bc.read_prob(HAS_NZ_PROB[comp])) {
					models[comp].nz_prob = bc.read_probability();
				}
				if (bc.read_prob(HAS_SIGN_PROB[comp])) {
					models[comp].sign_prob = bc.read_probability();
				}
			}
			for (let comp = 0; comp < 2; comp++) {
				for (let i = 0; i < HAS_TREE_PROB[comp].length; i++) {
					const prob = HAS_TREE_PROB[comp][i];
					if (bc.read_prob(prob)) {
						models[comp].tree_probs[i] = bc.read_probability();
					}
				}
			}
			for (let comp = 0; comp < 2; comp++) {
				for (let i = 0; i < HAS_RAW_PROB[comp].length; i++) {
					const prob = HAS_RAW_PROB[comp][i];
					if (bc.read_prob(prob)) {
						models[comp].raw_probs[i] = bc.read_probability();
					}
				}
			}
		}
		decode_coeff_models(bc, models, is_intra) {
			let def_prob = new Uint8Array(11);
			def_prob.fill(128);
			for (var plane = 0; plane < 2; plane++) {
				for (var i = 0; i < 11; i++) {
					if (bc.read_prob(HAS_COEF_PROBS[plane][i])) {
						def_prob[i] = bc.read_probability();
						models.coeff_models[plane].dc_value_probs[i] = def_prob[i];
					} else if (is_intra) {
						models.coeff_models[plane].dc_value_probs[i] = def_prob[i];
					}
				}
			}
			if (bc.read_bool()) {
				for (var i = 1; i < 64; i++) {
					if (bc.read_prob(HAS_SCAN_UPD_PROBS[i])) {
						models.vp6models.scan_order[i] = bc.read_bits(4);
					}
				}
				update_scan(models.vp6models);
			} else {
				reset_scan(models.vp6models, this.interlaced);
			}
			for (var comp = 0; comp < 2; comp++) {
				for (var i = 0; i < 14; i++) {
					if (bc.read_prob(HAS_ZERO_RUN_PROBS[comp][i])) {
						models.vp6models.zero_run_probs[comp][i] = bc.read_probability();
					}
				}
			}
			for (var ctype = 0; ctype < 3; ctype++) {
				for (var plane = 0; plane < 2; plane++) {
					for (var group = 0; group < 6; group++) {
						for (var i = 0; i < 11; i++) {
							if (bc.read_prob(VP6_AC_PROBS[ctype][plane][group][i])) {
								def_prob[i] = bc.read_probability();
								models.coeff_models[plane].ac_val_probs[ctype][group][i] = def_prob[i];
							} else if (is_intra) {
								models.coeff_models[plane].ac_val_probs[ctype][group][i] = def_prob[i];
							}
						}
					}
				}
			}
			for (var plane = 0; plane < 2; plane++) {
				let mdl = models.coeff_models[plane];
				for (var i = 0; i < 3; i++) {
					for (var k = 0; k < 5; k++) {
						mdl.dc_token_probs[0][i][k] = rescale_prob(mdl.dc_value_probs[k], VP6_DC_WEIGHTS[k][i], 255);
					}
				}
			}
		}
		decode_block(bc, coeffs, model, vp6model, fstate) {
			var left_ctx = fstate.coeff_cat[fstate.ctx_idx][0];
			var top_ctx = fstate.top_ctx;
			var dc_mode = top_ctx + left_ctx;
			var token = decode_token_bc(bc, model.dc_token_probs[0][dc_mode], model.dc_value_probs[5], true, true);
			var val = expand_token_bc(bc, model.dc_value_probs, token, 6);
			coeffs[0] = val;
			fstate.last_idx[fstate.ctx_idx] = 0;
			var idx = 1;
			var last_val = val;
			while (idx < 64) {
				var ac_band = VP6_IDX_TO_AC_BAND[idx];
				var ac_mode = Math.min(Math.abs(last_val), 2);
				var has_nnz = (idx == 1) || (last_val != 0);
				var _token = decode_token_bc(bc, model.ac_val_probs[ac_mode][ac_band], model.ac_val_probs[ac_mode][ac_band][5], false, has_nnz);
				if (_token == 42) break;
				var _val = expand_token_bc(bc, model.ac_val_probs[ac_mode][ac_band], _token, 6);
				coeffs[vp6model.zigzag[idx]] = asI16(_val * fstate.ac_quant);
				idx += 1;
				last_val = _val;
				if (_val == 0) {
					idx += decode_zero_run_bc(bc, vp6model.zero_run_probs[(idx >= 7) ? 1 : 0]);
					validate(idx <= 64);
				}
			}
			fstate.coeff_cat[fstate.ctx_idx][0] = (coeffs[0] != 0) ? 1 : 0;
			fstate.top_ctx = fstate.coeff_cat[fstate.ctx_idx][0];
			fstate.last_idx[fstate.ctx_idx] = idx;
		}
		mc_block(dst, mc_buf, src, plane, x, y, mv, loop_str) {
			let is_luma = (plane != 1) && (plane != 2);
			let sx, sy, mx, my, msx, msy;
			if (is_luma) {
				sx = mv.x >> 2;
				sy = mv.y >> 2;
				mx = (mv.x & 3) << 1;
				my = (mv.y & 3) << 1;
				msx = asI16(mv.x / 4);
				msy = asI16(mv.y / 4);
			} else {
				sx = mv.x >> 3;
				sy = mv.y >> 3;
				mx = mv.x & 7;
				my = mv.y & 7;
				msx = asI16(mv.x / 8);
				msy = asI16(mv.y / 8);
			}
			let tmp_blk = mc_buf.get_data();
			get_block(tmp_blk, 16, src, plane, x, y, sx, sy);
			if ((msx & 7) != 0) {
				let foff = (8 - (sx & 7));
				let off = 2 + foff;
				vp31_loop_filter(tmp_blk, off, 1, 16, 12, loop_str);
			}
			if ((msy & 7) != 0) {
				let foff = (8 - (sy & 7));
				let off = (2 + foff) * 16;
				vp31_loop_filter(tmp_blk, off, 16, 1, 12, loop_str);
			}
			let copy_mode = (mx == 0) && (my == 0);
			let bicubic = !copy_mode && is_luma && this.bicubic;
			if (is_luma && !copy_mode && (this.profile == VP6_ADVANCED_PROFILE)) {
				if (!this.autosel_pm) {
					bicubic = true;
				} else {
					let mv_limit = 1 << (this.mv_thresh + 1);
					if ((Math.abs(mv.x) <= mv_limit) && (Math.abs(mv.y) <= mv_limit)) {
						let var_off = 16 * 2 + 2;
						if (mv.x < 0) var_off += 1;
						if (mv.y < 0) var_off += 16;
						let _var = calc_variance(var_off, tmp_blk, 16);
						if (_var >= this.var_thresh) {
							bicubic = true;
						}
					}
				}
			}
			let dstride = dst.stride[plane];
			let dbuf = dst.data;
			let dbuf_offest = dst.offset[plane] + x + y * dstride;
			if (copy_mode) {
				let src_offest = 2 * 16 + 2;
				let dline_offest = 0;
				let sline_offest = 0;
				for (let _ = 0; _ < 8; _++) {
					dbuf[(dbuf_offest + dline_offest) + 0] = tmp_blk[(src_offest + sline_offest) + 0];
					dbuf[(dbuf_offest + dline_offest) + 1] = tmp_blk[(src_offest + sline_offest) + 1];
					dbuf[(dbuf_offest + dline_offest) + 2] = tmp_blk[(src_offest + sline_offest) + 2];
					dbuf[(dbuf_offest + dline_offest) + 3] = tmp_blk[(src_offest + sline_offest) + 3];
					dbuf[(dbuf_offest + dline_offest) + 4] = tmp_blk[(src_offest + sline_offest) + 4];
					dbuf[(dbuf_offest + dline_offest) + 5] = tmp_blk[(src_offest + sline_offest) + 5];
					dbuf[(dbuf_offest + dline_offest) + 6] = tmp_blk[(src_offest + sline_offest) + 6];
					dbuf[(dbuf_offest + dline_offest) + 7] = tmp_blk[(src_offest + sline_offest) + 7];
					dline_offest += dst.stride[plane];
					sline_offest += 16;
				}
			} else if (bicubic) {
				let coeff_h = VP6_BICUBIC_COEFFS[this.filter_alpha][mx];
				let coeff_v = VP6_BICUBIC_COEFFS[this.filter_alpha][my];
				mc_bicubic(dbuf_offest, dbuf, dstride, tmp_blk, 16 * 2 + 2, 16, coeff_h, coeff_v);
			} else {
				mc_bilinear(dbuf_offest, dbuf, dstride, tmp_blk, 16 * 2 + 2, 16, mx, my);
			}
		}
	}
	return {
		VP56Decoder,
		VP6BR,
		NADecoderSupport,
		BoolCoder,
		NAVideoInfo,
		YUV420_FORMAT,
		VP_YUVA420_FORMAT
	};
}());