/*!
 * Pinkfie - The Flash Player emulator in Javascript
 * 
 * v2.1.9 (2025-02-25)
 * 
 * Made in Peru
 */

var PinkFie = (function() {
	const multiplicationMatrix = function (a, b) {
		return [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
	};
	const multiplicationColor = function (a, b) {
		return [a[0] * b[0], a[1] * b[1], a[2] * b[2], a[3] * b[3], a[0] * b[4] + a[4], a[1] * b[5] + a[5], a[2] * b[6] + a[6], a[3] * b[7] + a[7]];
	};
	const generateColorTransform = function (color, data) {
		return [Math.max(0, Math.min(color[0] * data[0] + data[4], 255)) | 0, Math.max(0, Math.min(color[1] * data[1] + data[5], 255)) | 0, Math.max(0, Math.min(color[2] * data[2] + data[6], 255)) | 0, Math.max(0, Math.min(color[3] * 255 * data[3] + data[7], 255)) / 255];
	};
	const generateMatrix = function (point, data) {
		return [point[0] * data[0] + point[1] * data[2] + data[4], point[0] * data[1] + point[1] * data[3] + data[5]];
	};
	const boundsMatrix = function (bounds, matrix) {
		var no = Number.MAX_VALUE;
		var xMax = -no;
		var yMax = -no;
		var xMin = no;
		var yMin = no;
		var _xMin = bounds.xMin;
		var _xMax = bounds.xMax;
		var _yMin = bounds.yMin;
		var _yMax = bounds.yMax;
		var x0 = _xMax * matrix[0] + _yMax * matrix[2] + matrix[4];
		var x1 = _xMax * matrix[0] + _yMin * matrix[2] + matrix[4];
		var x2 = _xMin * matrix[0] + _yMax * matrix[2] + matrix[4];
		var x3 = _xMin * matrix[0] + _yMin * matrix[2] + matrix[4];
		var y0 = _xMax * matrix[1] + _yMax * matrix[3] + matrix[5];
		var y1 = _xMax * matrix[1] + _yMin * matrix[3] + matrix[5];
		var y2 = _xMin * matrix[1] + _yMax * matrix[3] + matrix[5];
		var y3 = _xMin * matrix[1] + _yMin * matrix[3] + matrix[5];
		return {
			xMin: Math.min(Math.min(Math.min(Math.min(xMin, x0), x1), x2), x3),
			xMax: Math.max(Math.max(Math.max(Math.max(xMax, x0), x1), x2), x3),
			yMin: Math.min(Math.min(Math.min(Math.min(yMin, y0), y1), y2), y3),
			yMax: Math.max(Math.max(Math.max(Math.max(yMax, y0), y1), y2), y3),
		};
	};
	function yuv420_to_rgba(y, u, v, y_width) {
		let y_height = (y.length / y_width) | 0;
		let chroma_width = ((y_width + 1) / 2) | 0;
		let rgba = new Uint8Array(y.length * 4);
		for (let h = 0; h < y_height; h++) {
			for (let w = 0; w < y_width; w++) {
				let idx = w + h * y_width;
				let chroma_idx = (w >> 1) + (h >> 1) * chroma_width;
				let Y = y[idx] - 16;
				let U = u[chroma_idx] - 128;
				let V = v[chroma_idx] - 128;
				let R = (1.164 * Y + 1.596 * V) | 0;
				let G = (1.164 * Y - 0.813 * V - 0.391 * U) | 0;
				let B = (1.164 * Y + 2.018 * U) | 0;
				let outputData_pos = w * 4 + y_width * h * 4;
				rgba[outputData_pos] = Math.max(Math.min(R, 255), 0);
				rgba[outputData_pos + 1] = Math.max(Math.min(G, 255), 0);
				rgba[outputData_pos + 2] = Math.max(Math.min(B, 255), 0);
				rgba[outputData_pos + 3] = 255;
			}
		}
		return rgba;
	}
	function isMobileOrTablet() {
		if (window) {
			return ("orientation" in window);
		}
		return false;
	}
	class ByteInput {
		constructor(arrayBuffer, start = 0, end = arrayBuffer.byteLength) {
			this.arrayBuffer = arrayBuffer;
			this.dataView = new DataView(arrayBuffer);
			this.start = start;
			this.end = end;
			this.bit_offset = 0;
			this._position = start;
			this.littleEndian = true;
		}
		get position() {
			return this._position - this.start;
		}
		set position(value) {
			this._position = value + this.start;
		}
		get length() {
			return this.end - this.start;
		}
		get bytesAvailable() {
			return this.end - this._position;
		}
		extract(length) {
			return new ByteInput(this.arrayBuffer, this._position, this._position + length);
		}
		from(start, end) {
			return new ByteInput(this.arrayBuffer, this.start + start, this.start + end);
		}
		readString(length) {
			var str = "";
			var count = length;
			while (count) {
				var code = this.dataView.getUint8(this._position++);
				str += String.fromCharCode(code);
				count--;
			}
			return str;
		}
		readBytes(length) {
			this.byteAlign();
			var bytes = this.arrayBuffer.slice(this._position, this._position + length);
			this._position += length;
			return bytes;
		}
		readStringWithUntil() {
			this.byteAlign();
			var bo = this._position;
			var offset = 0;
			var length = this.end;
			var ret = "";
			while (true) {
				var val = this.dataView.getUint8(bo + offset);
				offset++;
				if (val === 0 || bo + offset >= length) break;
				ret += String.fromCharCode(val);
			}
			this._position = bo + offset;
			return ret;
		}
		readStringWithLength() {
			var count = this.readUint8();
			var val = "";
			while (count--) {
				var dat = this.dataView.getUint8(this._position++);
				if (dat == 0) continue;
				val += String.fromCharCode(dat);
			}
			return val;
		}
		incrementOffset(byteInt, bitInt) {
			this._position += byteInt;
			this.bit_offset += bitInt;
			this.byteCarry();
		}
		setOffset(byteInt, bitInt) {
			this._position = byteInt + this.start;
			this.bit_offset = bitInt;
		}
		byteAlign() {
			if (!this.bit_offset) return;
			this._position += ((this.bit_offset + 7) / 8) | 0;
			this.bit_offset = 0;
		}
		readUint8() {
			this.byteAlign();
			return this.dataView.getUint8(this._position++);
		}
		readUint16() {
			this.byteAlign();
			var value = this.dataView.getUint16(this._position, this.littleEndian);
			this._position += 2;
			return value;
		}
		readUint24() {
			this.byteAlign();
			var value = this.dataView.getUint8(this._position++);
			value += 0x100 * this.dataView.getUint8(this._position++);
			value += 0x10000 * this.dataView.getUint8(this._position++);
			return value;
		}
		readUint32() {
			this.byteAlign();
			var value = this.dataView.getUint32(this._position, this.littleEndian);
			this._position += 4;
			return value;
		}
		readUint64() {
			this.byteAlign();
			var value = this.readUint32();
			value += Math.pow(2, 32) * this.readUint32();
			return value;
		}
		readInt8() {
			this.byteAlign();
			return this.dataView.getInt8(this._position++);
		}
		readInt16() {
			this.byteAlign();
			var value = this.dataView.getInt16(this._position, this.littleEndian);
			this._position += 2;
			return value;
		}
		readInt24() {
			let t = this.readUint24();
			return t >> 23 && (t -= 16777216), t;
		}
		readInt32() {
			this.byteAlign();
			var value = this.dataView.getInt32(this._position, this.littleEndian);
			this._position += 4;
			return value;
		}
		readFixed8() {
			return +(this.readInt16() / 0x100).toFixed(1);
		}
		readFixed16() {
			return +(this.readInt32() / 0x10000).toFixed(2);
		}
		readFloat16() {
			const t = this.dataView.getUint8(this._position++);
			let e = 0;
			return ((e |= this.dataView.getUint8(this._position++) << 8), (e |= t << 0), e);
		}
		readFloat32() {
			var t = this.dataView.getUint8(this._position++);
			var e = this.dataView.getUint8(this._position++);
			var s = this.dataView.getUint8(this._position++);
			var a = 0;
			(a |= this.dataView.getUint8(this._position++) << 24), (a |= s << 16), (a |= e << 8), (a |= t << 0);
			const i = (a >> 23) & 255;
			return a && 2147483648 !== a ? (2147483648 & a ? -1 : 1) * (8388608 | (8388607 & a)) * Math.pow(2, i - 127 - 23) : 0;
		}
		readFloat64() {
			var upperBits = this.readUint32();
			var lowerBits = this.readUint32();
			var sign = (upperBits >>> 31) & 0x1;
			var exp = (upperBits >>> 20) & 0x7ff;
			var upperFraction = upperBits & 0xfffff;
			return !upperBits && !lowerBits ? 0 : (sign === 0 ? 1 : -1) * (upperFraction / 1048576 + lowerBits / 4503599627370496 + 1) * Math.pow(2, exp - 1023);
		}
		readDouble() {
			var v = this.dataView.getFloat64(this._position, this.littleEndian);
			this._position += 8;
			return v;
		}
		readEncodedU32() {
			this.byteAlign();
			let val = 0;
			for (let e = 0; 5 > e; ++e) {
				let byte = this.dataView.getUint8(this._position++);
				val |= (127 & byte) << (7 * e);
				if ((128 & byte) == 0) break;
			}
			return val;
		}
		byteCarry() {
			if (this.bit_offset > 7) {
				this._position += ((this.bit_offset + 7) / 8) | 0;
				this.bit_offset &= 0x07;
			} else {
				while (this.bit_offset < 0) {
					this._position--;
					this.bit_offset += 8;
				}
			}
		}
		readUB(n) {
			var value = 0;
			while (n--) (value <<= 1), (value |= this.readBit());
			return value;
		}
		readSB(n) {
			var uval = this.readUB(n);
			var shift = 32 - n;
			return (uval << shift) >> shift;
		}
		readBit() {
			var val = (this.dataView.getUint8(this._position) >> (7 - this.bit_offset++)) & 0x1;
			return this.byteCarry(), val;
		}
		readSBFixed8(n) {
			return +(this.readSB(n) / 0x100).toFixed(2);
		}
		readSBFixed16(n) {
			return +(this.readSB(n) / 0x10000).toFixed(4);
		}
	}

	const ZLib = (function() {const A = {key: new Uint16Array([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]), value: new Uint16Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])}, S = {key: new Uint16Array([7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]), value: new Uint16Array([256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 280, 281, 282, 283, 284, 285, 286, 287, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255])};const Q = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), W = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99]), E = new Uint16Array([3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]), R = new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]), T = new Uint16Array([1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577]);class B {constructor(_, a = 0, b = 0) {this.data = _, this.byte_offset = a, this.bit_offset = b, this.bit_buffer = null} readSubArray(n) {var a = this.data.subarray(this.byte_offset, this.byte_offset + n); return this.byte_offset += n, a;} readUint8() {return this.data[this.byte_offset++]} readUint16be() {var a = (this.data[this.byte_offset + 1] << 8) + this.data[this.byte_offset]; return this.byte_offset += 2, a} readUB(n) {let z = 0; for (let i = 0; i < n; i++) {if (this.bit_offset === 8) this.bit_buffer = this.data[this.byte_offset++], this.bit_offset = 0;z |= (this.bit_buffer & (1 << this.bit_offset++) ? 1 : 0) << i};return z}};const D = function (_) {let r = Math.max.apply(null, _);const p = _.length, c = new Uint8Array(r);let i = p, j = 0;while (i--) j = _[i], c[j] += (j > 0);let m = 0, o = 0;const g = new Uint16Array(r + 1);for (i = 0; i < r; ) m = (m + c[i++]) << 1, g[i] = m | 0, o = Math.max(o, m);const n = o + p, k = new Uint16Array(n), v = new Uint16Array(n);for (i = 0; i < p; i++) {if (j = _[i], j) {const u = g[j]; k[u] = j, v[u] = i, g[j] = (u + 1) | 0}};return {key: k, value: v}};const F = function (x, y, z) {let a = 0, b = 0;while (true) {b = (b << 1) | x.readUB(1); a++; if (y[b] === a) return z[b];}};return {decompress: function (_, n, v) {var a = v || 0; const o = new Uint8Array(n), br = new B(new Uint8Array(_), a + 2, 8), h = new Uint8Array(19); var y = 0, i = 0, b = 0, f = 0; while (!f) {f = br.readUB(1); let u = br.readUB(2), j = null, l = null; switch (u) {case 0: br.bit_offset = 8, br.bit_buffer = null, b = br.readUint16be(), br.byte_offset += 2, o.set(br.readSubArray(b), a), a += b; break; default: switch (u) {case 1: j = A, l = S; break; default: const q = br.readUB(5) + 257, w = br.readUB(5) + 1, e = br.readUB(4) + 4; for (i = 0; i < e; i++) h[Q[i]] = br.readUB(3); const s = D(h); h.fill(0); const c = q + w, d = new Uint8Array(c); let z = 0, t = 0; while (t < c) {y = F(br, s.key, s.value);switch (y) {case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7: case 8: case 9: case 10: case 11: case 12: case 13: case 14: case 15: d[t++] = y, z = y; break; case 16: i = br.readUB(2) + 3, d.fill(z, t, t + i), t += i; break; case 17: i = br.readUB(3) + 3, t += i; break; case 18: i = br.readUB(7) + 11, t += i; break;}};j = D(d.subarray(q)), l = D(d.subarray(0, q))};y = 0;while (true) {if (y = 0 | F(br, l.key, l.value), 256 === y) break;if (y < 256) {o[a++] = y} else {const z = (y - 257) | 0; b = (E[z] + br.readUB(W[z])) | 0; const x = F(br, j.key, j.value); i = (a - ((T[x] + br.readUB(R[x])) | 0)) | 0; while (b--) o[a++] = o[i++];}}}} return o.buffer}}}());
	const LZMA = (function() {const LZMA = {init: function(e) {const t = [];t.push(e[12], e[13], e[14], e[15], e[16], e[4], e[5], e[6], e[7]);let s = 8;for (let e = 5; e < 9; ++e) {if (t[e] >= s) {t[e] = t[e] - s | 0;break}t[e] = 256 + t[e] - s | 0,s = 1}return t.push(0, 0, 0, 0),e.set(t, 4),e.subarray(4)},reverseDecode2: function(e, t, s, i) {let r = 1, o = 0, d = 0;for (; d < i; ++d) {const i = s.decodeBit(e, t + r);r = r << 1 | i,o |= i << d}return o},decompress: function(e, t) {const s = new Decoder, i = s.decodeHeader(e), r = i.uncompressedSize;if (s.setProperties(i),!s.decodeBody(e, t, r))throw new Error("Error in lzma data stream");return t}};class OutWindow {constructor() {this._buffer = null,this._stream = null,this._pos = 0,this._streamPos = 0,this._windowSize = 0}create(e) {this._buffer && this._windowSize === e || (this._buffer = new Uint8Array(e)),this._windowSize = e}flush() {const e = this._pos - this._streamPos;e && (this._stream.writeBytes(this._buffer, e),this._pos >= this._windowSize && (this._pos = 0),this._streamPos = this._pos)}releaseStream() {this.flush(),this._stream = null}setStream(e) {this._stream = e}init(e=!1) {e || (this._streamPos = 0,this._pos = 0)}copyBlock(e, t) {let s = this._pos - e - 1;for (s < 0 && (s += this._windowSize); t--; )s >= this._windowSize && (s = 0),this._buffer[this._pos++] = this._buffer[s++],this._pos >= this._windowSize && this.flush()}putByte(e) {this._buffer[this._pos++] = e,this._pos >= this._windowSize && this.flush()}getByte(e) {let t = this._pos - e - 1;return t < 0 && (t += this._windowSize),this._buffer[t]}}class RangeDecoder {constructor() {this._stream = null,this._code = 0,this._range = -1}setStream(e) {this._stream = e}releaseStream() {this._stream = null}init() {let e = 5;for (this._code = 0,this._range = -1; e--; )this._code = this._code << 8 | this._stream.readByte()}decodeDirectBits(e) {let t = 0, s = e;for (; s--; ) {this._range >>>= 1;const e = this._code - this._range >>> 31;this._code -= this._range & e - 1,t = t << 1 | 1 - e,0 == (4278190080 & this._range) && (this._code = this._code << 8 | this._stream.readByte(),this._range <<= 8)}return t}decodeBit(e, t) {const s = e[t], i = (this._range >>> 11) * s;return (2147483648 ^ this._code) < (2147483648 ^ i) ? (this._range = i,e[t] += 2048 - s >>> 5,0 == (4278190080 & this._range) && (this._code = this._code << 8 | this._stream.readByte(),this._range <<= 8),0) : (this._range -= i,this._code -= i,e[t] -= s >>> 5,0 == (4278190080 & this._range) && (this._code = this._code << 8 | this._stream.readByte(),this._range <<= 8),1)}}class BitTreeDecoder {constructor(e) {this._models = Array(1 << e).fill(1024),this._numBitLevels = e}decode(e) {let t = 1, s = this._numBitLevels;for (; s--; )t = t << 1 | e.decodeBit(this._models, t);return t - (1 << this._numBitLevels)}reverseDecode(e) {let t = 1, s = 0, i = 0;for (; i < this._numBitLevels; ++i) {const r = e.decodeBit(this._models, t);t = t << 1 | r,s |= r << i}return s}}class LenDecoder {constructor() {this._choice = [1024, 1024],this._lowCoder = [],this._midCoder = [],this._highCoder = new BitTreeDecoder(8),this._numPosStates = 0}create(e) {for (; this._numPosStates < e; ++this._numPosStates)this._lowCoder[this._numPosStates] = new BitTreeDecoder(3),this._midCoder[this._numPosStates] = new BitTreeDecoder(3)}decode(e, t) {return 0 === e.decodeBit(this._choice, 0) ? this._lowCoder[t].decode(e) : 0 === e.decodeBit(this._choice, 1) ? 8 + this._midCoder[t].decode(e) : 16 + this._highCoder.decode(e)}}class Decoder2 {constructor() {this._decoders = Array(768).fill(1024)}decodeNormal(e) {let t = 1;do {t = t << 1 | e.decodeBit(this._decoders, t)} while (t < 256);return 255 & t}decodeWithMatchByte(e, t) {let s = 1;do {const i = t >> 7 & 1;t <<= 1;const r = e.decodeBit(this._decoders, (1 + i << 8) + s);if (s = s << 1 | r,i !== r) {for (; s < 256; )s = s << 1 | e.decodeBit(this._decoders, s);break}} while (s < 256);return 255 & s}}class LiteralDecoder {constructor() {}create(e, t) {if (this._coders && this._numPrevBits === t && this._numPosBits === e)return;this._numPosBits = e,this._posMask = (1 << e) - 1,this._numPrevBits = t,this._coders = [];let s = 1 << this._numPrevBits + this._numPosBits;for (; s--; )this._coders[s] = new Decoder2}getDecoder(e, t) {return this._coders[((e & this._posMask) << this._numPrevBits) + ((255 & t) >>> 8 - this._numPrevBits)]}}class Decoder {constructor() {this._outWindow = new OutWindow,this._rangeDecoder = new RangeDecoder,this._isMatchDecoders = Array(192).fill(1024),this._isRepDecoders = Array(12).fill(1024),this._isRepG0Decoders = Array(12).fill(1024),this._isRepG1Decoders = Array(12).fill(1024),this._isRepG2Decoders = Array(12).fill(1024),this._isRep0LongDecoders = Array(192).fill(1024),this._posDecoders = Array(114).fill(1024),this._posAlignDecoder = new BitTreeDecoder(4),this._lenDecoder = new LenDecoder,this._repLenDecoder = new LenDecoder,this._literalDecoder = new LiteralDecoder,this._dictionarySize = -1,this._dictionarySizeCheck = -1,this._posSlotDecoder = [new BitTreeDecoder(6), new BitTreeDecoder(6), new BitTreeDecoder(6), new BitTreeDecoder(6)]}setDictionarySize(e) {return !(e < 0) && (this._dictionarySize !== e && (this._dictionarySize = e,this._dictionarySizeCheck = Math.max(this._dictionarySize, 1),this._outWindow.create(Math.max(this._dictionarySizeCheck, 4096))),!0)}setLcLpPb(e, t, s) {if (e > 8 || t > 4 || s > 4)return !1;const i = 1 << s;return this._literalDecoder.create(t, e),this._lenDecoder.create(i),this._repLenDecoder.create(i),this._posStateMask = i - 1,!0}setProperties(e) {if (!this.setLcLpPb(e.lc, e.lp, e.pb))throw Error("Incorrect stream properties");if (!this.setDictionarySize(e.dictionarySize))throw Error("Invalid dictionary size")}decodeHeader(e) {if (e._$size < 13)return !1;let t = e.readByte();const s = t % 9;t = ~~(t / 9);const i = t % 5, r = ~~(t / 5);let o = e.readByte();o |= e.readByte() << 8,o |= e.readByte() << 16,o += 16777216 * e.readByte();let d = e.readByte();return d |= e.readByte() << 8,d |= e.readByte() << 16,d += 16777216 * e.readByte(),e.readByte(),e.readByte(),e.readByte(),e.readByte(),{lc: s,lp: i,pb: r,dictionarySize: o,uncompressedSize: d}}decodeBody(e, t, s) {let i, r, o = 0, d = 0, h = 0, c = 0, n = 0, _ = 0, a = 0;for (this._rangeDecoder.setStream(e),this._rangeDecoder.init(),this._outWindow.setStream(t),this._outWindow.init(!1); _ < s; ) {const e = _ & this._posStateMask;if (0 === this._rangeDecoder.decodeBit(this._isMatchDecoders, (o << 4) + e)) {const e = this._literalDecoder.getDecoder(_++, a);a = o >= 7 ? e.decodeWithMatchByte(this._rangeDecoder, this._outWindow.getByte(d)) : e.decodeNormal(this._rangeDecoder),this._outWindow.putByte(a),o = o < 4 ? 0 : o - (o < 10 ? 3 : 6)} else {if (1 === this._rangeDecoder.decodeBit(this._isRepDecoders, o))i = 0,0 === this._rangeDecoder.decodeBit(this._isRepG0Decoders, o) ? 0 === this._rangeDecoder.decodeBit(this._isRep0LongDecoders, (o << 4) + e) && (o = o < 7 ? 9 : 11,i = 1) : (0 === this._rangeDecoder.decodeBit(this._isRepG1Decoders, o) ? r = h : (0 === this._rangeDecoder.decodeBit(this._isRepG2Decoders, o) ? r = c : (r = n,n = c),c = h),h = d,d = r),0 === i && (i = 2 + this._repLenDecoder.decode(this._rangeDecoder, e),o = o < 7 ? 8 : 11);else {n = c,c = h,h = d,i = 2 + this._lenDecoder.decode(this._rangeDecoder, e),o = o < 7 ? 7 : 10;const t = this._posSlotDecoder[i <= 5 ? i - 2 : 3].decode(this._rangeDecoder);if (t >= 4) {const e = (t >> 1) - 1;if (d = (2 | 1 & t) << e,t < 14)d += LZMA.reverseDecode2(this._posDecoders, d - t - 1, this._rangeDecoder, e);else if (d += this._rangeDecoder.decodeDirectBits(e - 4) << 4,d += this._posAlignDecoder.reverseDecode(this._rangeDecoder),d < 0) {if (-1 === d)break;return !1}} else d = t}if (d >= _ || d >= this._dictionarySizeCheck)return !1;this._outWindow.copyBlock(d, i),_ += i,a = this._outWindow.getByte(0)}}return this._outWindow.releaseStream(),this._rangeDecoder.releaseStream(),!0}}class InStream {constructor(e) {this._$data = e;this._$size = e.length;this._$offset = 0;}readByte() {return this._$data[this._$offset++];}}class OutStream {constructor(e) {this.size = 8;this.buffers = e;}writeBytes(e, t) {if (e.length === t) {this.buffers.set(e, this.size);} else {this.buffers.set(e.subarray(0, t), this.size);}this.size += t;}}return {decompress: function (data, fileLength) {const t = fileLength,s = data,i = new Uint8Array(t + 8);i.set(s.slice(0, 8), 0);LZMA.decompress(new InStream(LZMA.init(s)), new OutStream(i));return i}};}());
	
	const ShapeToRenderer = {
		shapeToRendererInfo: function (shapes) {
			const result = [];
			for (let i = 0; i < shapes.length; i++) {
				const s = shapes[i];
				var obj = s.obj;
				var cmd = s.cmd;
				result.push(this.lagObjToInfo(obj, cmd));
			}
			return result;
		},
		lagObjToInfo: function (obj, cmd) {
			var isLine = "width" in obj;
			if (isLine) {
				return {
					type: 1,
					width: obj.width,
					path2d: cmd,
					fill: this.lineToInfo(obj),
				};
			} else {
				return {
					type: 0,
					path2d: cmd,
					fill: this.fillToInfo(obj),
				};
			}
		},
		fillToInfo: function (fill) {
			var type = fill.type;
			switch (type) {
				case 0:
					var color = fill.color;
					return {
						type: 0,
						color: color,
					};
				case 0x10:
				case 0x12:
				case 0x13:
					var gradient = fill.gradient;
					if (!gradient) 
						gradient = fill.linearGradient;
					if (!gradient) 
						gradient = fill.radialGradient;
					var gradientMatrix = gradient.matrix;
					var isRadial = type !== 16;
					var focal = 0;
					if (type == 19) 
						focal = fill.focalPoint || 0;
					var gradientRecords = gradient.gradientRecords;
					var css = [];
					for (var rIdx = 0; rIdx < gradientRecords.length; rIdx++) {
						var record = gradientRecords[rIdx];
						var color = record.color;
						var ratio = record.ratio;
						css.push([color, ratio]);
					}
					var repeat_mode = (gradient.spreadMode == 2) ? 1 : ((gradient.spreadMode == 1) ? 2 : 0);
					return {
						type: 1,
						matrix: gradientMatrix,
						focal: focal,
						isRadial,
						records: css,
						repeat: repeat_mode,
					};
				case 0x40:
				case 0x41:
				case 0x42:
				case 0x43:
					var bitmapId = fill.bitmapId;
					var bMatrix = fill.bitmapMatrix;
					return {
						type: 2,
						matrix: bMatrix,
						id: bitmapId,
						isSmoothed: fill.isSmoothed,
						isRepeating: fill.isRepeating,
					};
				default:
					return null;
			}
		},
		lineToInfo: function (line) {
			if ("fillType" in line) {
				return this.fillToInfo(line.fillType);
			} else {
				return {
					type: 0,
					color: line.color,
				};
			}
		},
	};
	const shapeUtils = {
		calculateShapeBounds: function (shapeRecords) {
			var xMin = Infinity;
			var yMin = Infinity;
			var xMax = -Infinity;
			var yMax = -Infinity;
			function dfgfd(x, y) {
				if (x < xMin) xMin = x;
				if (y < yMin) yMin = y;
				if (x > xMax) xMax = x;
				if (y > yMax) yMax = y;
			}
			var currentPosition = { x: 0, y: 0 };
			var hasShapeRecord = false;
			for (let i = 0; i < shapeRecords.length; i++) {
				const record = shapeRecords[i];
				if (!record) continue;
				hasShapeRecord = true;
				if (record.isChange) {
					if (record.stateMoveTo) {
						currentPosition.x = record.moveX;
						currentPosition.y = record.moveY;
						dfgfd(currentPosition.x, currentPosition.y);
					}
				} else {
					var isCurved = record.isCurved;
					if (isCurved) {
						var _controlX = currentPosition.x + record.controlDeltaX;
						var _controlY = currentPosition.y + record.controlDeltaY;
						currentPosition.x = _controlX + record.anchorDeltaX;
						currentPosition.y = _controlY + record.anchorDeltaY;
						dfgfd(_controlX, _controlY);
						dfgfd(currentPosition.x, currentPosition.y);
					} else {
						currentPosition.x += record.deltaX;
						currentPosition.y += record.deltaY;
						dfgfd(currentPosition.x, currentPosition.y);
					}
				}
			}
			if (hasShapeRecord) {
				return { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax };
			} else {
				return { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
			}
		},
		convertCurrentPosition: function (src) {
			var array = [];
			var currentPosition = { x: 0, y: 0 };
			for (let i = 0; i < src.length; i++) {
				const record = src[i];
				if (record) {
					if (record.isChange) {
						if (record.stateMoveTo) {
							currentPosition.x = record.moveX;
							currentPosition.y = record.moveY;
						}
						array.push(record);
					} else {
						var isCurved = record.isCurved;
						if (isCurved) {
							var _controlX = currentPosition.x + record.controlDeltaX;
							var _controlY = currentPosition.y + record.controlDeltaY;
							currentPosition.x = _controlX + record.anchorDeltaX;
							currentPosition.y = _controlY + record.anchorDeltaY;
							array.push({
								controlX: _controlX,
								controlY: _controlY,
								anchorX: currentPosition.x,
								anchorY: currentPosition.y,
								isCurved: true,
								isChange: false,
							});
						} else {
							currentPosition.x += record.deltaX;
							currentPosition.y += record.deltaY;
							array.push({
								controlX: 0,
								controlY: 0,
								anchorX: currentPosition.x,
								anchorY: currentPosition.y,
								isCurved: false,
								isChange: false,
							});
						}
					}
				} else {
					array.push(null);
				}
			}
			array.push(null);
			return array;
		},
		convertWithCacheCodes: function (shapeRecords) {
			var records = this.convertCurrentPosition(shapeRecords);
			var _cmd = [];
			for (var i = 0; i < records.length; i++) {
				var record = records[i];
				if (!record) break;
				var isCurved = record.isCurved;
				var isChange = record.isChange;
				var code;
				if (isChange) {
					code = [0, record.moveX || 0, record.moveY || 0];
				} else {
					if (isCurved) {
						code = [1, record.controlX, record.controlY, record.anchorX, record.anchorY];
					} else {
						code = [2, record.anchorX, record.anchorY];
					}
				}
				_cmd.push(code);
			}
			return [{
				type: 0,
				path2d: _cmd,
				fill: {
					type: 0,
					color: [255, 255, 255, 1],
				}
			}];
		},
		convert: function (shapes, type) {
			var isMorph = type == "morphshape";
			var lineStyles = shapes.lineStyles || [];
			var fillStyles = shapes.fillStyles || [];
			var records = this.convertCurrentPosition(shapes.shapeRecords);
			var idx = 0;
			var obj = {};
			var cache = [];
			var AnchorX = 0;
			var AnchorY = 0;
			var MoveX = 0;
			var MoveY = 0;
			var LineX = 0;
			var LineY = 0;
			var FillStyle0 = 0;
			var FillStyle1 = 0;
			var LineStyle = 0;
			var fills0 = [];
			var fills1 = [];
			var lines = [];
			var stack = [];
			var depth = 0;
			var length = records.length;
			for (var i = 0; i < length; i++) {
				var record = records[i];
				if (!record) {
					this.setStack(stack, this.fillMerge(fills0, fills1, isMorph));
					this.setStack(stack, lines);
					break;
				}
				if (record.isChange) {
					depth++;
					if (record.stateNewStyles) {
						AnchorX = 0;
						AnchorY = 0;
						this.setStack(stack, this.fillMerge(fills0, fills1, isMorph));
						this.setStack(stack, lines);
						fills0 = [];
						fills1 = [];
						lines = [];
						if (record.numFillBits) fillStyles = record.fillStyles;
						if (record.numLineBits) lineStyles = record.lineStyles;
					}
					MoveX = AnchorX;
					MoveY = AnchorY;
					if (record.stateMoveTo) {
						MoveX = record.moveX;
						MoveY = record.moveY;
					}
					LineX = MoveX;
					LineY = MoveY;
					if (record.stateFillStyle0) FillStyle0 = record.fillStyle0;
					if (record.stateFillStyle1) FillStyle1 = record.fillStyle1;
					if (record.stateLineStyle) LineStyle = record.lineStyle;
				} else {
					var isCurved = record.isCurved;
					AnchorX = record.anchorX;
					AnchorY = record.anchorY;
					var ControlX = record.controlX;
					var ControlY = record.controlY;
					if (FillStyle0) {
						idx = FillStyle0 - 1;
						if (!(idx in fills0)) fills0[idx] = [];
						if (!(depth in fills0[idx])) {
							fills0[idx][depth] = {
								obj: fillStyles[idx],
								startX: MoveX,
								startY: MoveY,
								endX: 0,
								endY: 0,
								cache: [],
							};
						}
						obj = fills0[idx][depth];
						cache = obj.cache;
						cache[cache.length] = JSON.parse(JSON.stringify(record));
						obj.endX = AnchorX;
						obj.endY = AnchorY;
					}
					if (FillStyle1) {
						idx = FillStyle1 - 1;
						if (!(idx in fills1)) fills1[idx] = [];
						if (!(depth in fills1[idx])) {
							fills1[idx][depth] = {
								obj: fillStyles[idx],
								startX: MoveX,
								startY: MoveY,
								endX: 0,
								endY: 0,
								cache: [],
							};
						}
						obj = fills1[idx][depth];
						cache = obj.cache;
						cache[cache.length] = JSON.parse(JSON.stringify(record));
						obj.endX = AnchorX;
						obj.endY = AnchorY;
					}
					if (LineStyle) {
						idx = LineStyle - 1;
						if (!(idx in lines)) {
							lines[idx] = {
								obj: lineStyles[idx],
								cache: [],
							};
						}
						obj = lines[idx];
						cache = obj.cache;
						cache[cache.length] = [0, LineX, LineY];
						var code = [2, AnchorX, AnchorY];
						if (isCurved) {
							code = [1, ControlX, ControlY, AnchorX, AnchorY];
						}
						cache[cache.length] = code;
					}
					LineX = AnchorX;
					LineY = AnchorY;
				}
			}
			return ShapeToRenderer.shapeToRendererInfo(stack);
		},
		fillMerge: function (fills0, fills1, isMorph) {
			fills0 = this.fillReverse(fills0);
			if (fills0.length) {
				for (var i in fills0) {
					if (!fills0.hasOwnProperty(i)) continue;
					var fills = fills0[i];
					if (i in fills1) {
						var fill1 = fills1[i];
						for (var depth in fills) {
							if (!fills.hasOwnProperty(depth)) continue;
							fill1[fill1.length] = fills[depth];
						}
					} else {
						fills1[i] = fills;
					}
				}
			}
			return this.coordinateAdjustment(fills1, isMorph);
		},
		fillReverse: function (fills0) {
			if (!fills0.length) return fills0;
			for (var i in fills0) {
				if (!fills0.hasOwnProperty(i)) continue;
				var fills = fills0[i];
				for (var depth in fills) {
					if (!fills.hasOwnProperty(depth)) continue;
					var AnchorX = 0;
					var AnchorY = 0;
					var obj = fills[depth];
					var cacheX = obj.startX;
					var cacheY = obj.startY;
					var cache = obj.cache;
					var length = cache.length;
					if (length) {
						for (var idx in cache) {
							if (!cache.hasOwnProperty(idx)) continue;
							var recode = cache[idx];
							AnchorX = recode.anchorX;
							AnchorY = recode.anchorY;
							recode.anchorX = cacheX;
							recode.anchorY = cacheY;
							cacheX = AnchorX;
							cacheY = AnchorY;
						}
						var array = [];
						if (length > 0) {
							while (length--) {
								array[array.length] = cache[length];
							}
						}
						obj.cache = array;
					}
					cacheX = obj.startX;
					cacheY = obj.startY;
					obj.startX = obj.endX;
					obj.startY = obj.endY;
					obj.endX = cacheX;
					obj.endY = cacheY;
				}
			}
			return fills0;
		},
		coordinateAdjustment: function (fills1, isMorph) {
			for (var i in fills1) {
				if (!fills1.hasOwnProperty(i)) {
					continue;
				}
				var array = [];
				var fills = fills1[i];
				for (var depth in fills) {
					if (!fills.hasOwnProperty(depth)) continue;
					array[array.length] = fills[depth];
				}
				var adjustment = [];
				if (array.length > 1 && !isMorph) {
					while (true) {
						if (!array.length) break;
						var fill = array.shift();
						if (fill.startX === fill.endX && fill.startY === fill.endY) {
							adjustment[adjustment.length] = fill;
							continue;
						}
						var mLen = array.length;
						if (mLen < 0) break;
						var isMatch = 0;
						while (mLen--) {
							var comparison = array[mLen];
							if (comparison.startX === fill.endX && comparison.startY === fill.endY) {
								fill.endX = comparison.endX;
								fill.endY = comparison.endY;
								var cache0 = fill.cache;
								var cache1 = comparison.cache;
								var cLen = cache1.length;
								for (var cIdx = 0; cIdx < cLen; cIdx++) {
									cache0[cache0.length] = cache1[cIdx];
								}
								array.splice(mLen, 1);
								array.unshift(fill);
								isMatch = 1;
								break;
							}
						}
						if (!isMatch) {
							array.unshift(fill);
						}
					}
				} else {
					adjustment = array;
				}
				var aLen = adjustment.length;
				var cache = [];
				var obj = {};
				for (var idx = 0; idx < aLen; idx++) {
					var data = adjustment[idx];
					obj = data.obj;
					var caches = data.cache;
					var cacheLength = caches.length;
					cache[cache.length] = [0, data.startX, data.startY];
					for (var compIdx = 0; compIdx < cacheLength; compIdx++) {
						var r = caches[compIdx];
						var code = [2, r.anchorX, r.anchorY];
						if (r.isCurved)
							code = [1, r.controlX, r.controlY, r.anchorX, r.anchorY];
						cache[cache.length] = code;
					}
				}
				fills1[i] = { cache: cache, obj: obj };
			}
			return fills1;
		},
		setStack: function (stack, array) {
			if (array.length) {
				for (var i in array) {
					if (!array.hasOwnProperty(i)) continue;
					var data = array[i];
					stack.push({
						obj: data.obj,
						cmd: data.cache,
					});
				}
			}
		},
	};
	const SwfTypes = {
		tags: {0: "End", 1: "ShowFrame", 2: "DefineShape", 4: "PlaceObject", 5: "RemoveObject", 6: "DefineBits", 7: "DefineButton", 8: "JpegTables", 9: "SetBackgroundColor", 10: "DefineFont", 11: "DefineText", 12: "DoAction", 13: "DefineFontInfo", 14: "DefineSound", 15: "StartSound", 17: "DefineButtonSound", 18: "SoundStreamHead", 19: "SoundStreamBlock", 20: "DefineBitsLossless", 21: "DefineBitsJpeg2", 22: "DefineShape2", 23: "DefineButtonCxform", 24: "Protect", 26: "PlaceObject2", 28: "RemoveObject2", 32: "DefineShape3", 33: "DefineText2", 34: "DefineButton2", 35: "DefineBitsJpeg3", 36: "DefineBitsLossless2", 37: "DefineEditText", 39: "DefineSprite", 40: "NameCharacter", 41: "ProductInfo", 43: "FrameLabel", 45: "SoundStreamHead2", 46: "DefineMorphShape", 48: "DefineFont2", 56: "ExportAssets", 57: "ImportAssets", 58: "EnableDebugger", 59: "DoInitAction", 60: "DefineVideoStream", 61: "VideoFrame", 62: "DefineFontInfo2", 63: "DebugId", 64: "EnableDebugger2", 65: "ScriptLimits", 66: "SetTabIndex", 69: "FileAttributes", 70: "PlaceObject3", 71: "ImportAssets2", 72: "DoAbc", 73: "DefineFontAlignZones", 74: "CsmTextSettings", 75: "DefineFont3", 76: "SymbolClass", 77: "Metadata", 78: "DefineScalingGrid", 82: "DoAbc2", 83: "DefineShape4", 84: "DefineMorphShape2", 86: "DefineSceneAndFrameLabelData", 87: "DefineBinaryData", 88: "DefineFontName", 89: "StartSound2", 90: "DefineBitsJpeg4", 91: "DefineFont4", 93: "EnableTelemetry", 94: "PlaceObject4"},
		sound: {
			compression: {
				0: "uncompressedUnknownEndian",
				1: "ADPCM",
				2: "MP3",
				3: "uncompressed",
				4: "nellymoser16Khz",
				5: "nellymoser8Khz",
				6: "nellymoser",
				11: "speex",
			},
			sampleRate: {
				0: 5512,
				1: 11025,
				2: 22050,
				3: 44100,
			},
		},
		video: {
			codec: {
				0: "none",
				2: "H263",
				3: "ScreenVideo",
				4: "Vp6",
				5: "Vp6WithAlpha",
				6: "ScreenVideoV2",
			},
			deblocking: {
				0: "useVideoPacketValue",
				1: "none",
				2: "Level1",
				3: "Level2",
				4: "Level3",
				5: "Level4",
			},
		},
	};
	class SwfInput {
		constructor(byte_input, version) {
			this.input = byte_input;
			this._swfVersion = version;
		}
		static decompressSwf(swfData) {
			var byte_input = new ByteInput(swfData);
			var compression = byte_input.readString(3);
			var version = byte_input.readUint8();
			if (version == 0) {
				throw new Error("this data is not swf version");
			}
			var uncompressedLength = byte_input.readUint32();
			switch (compression) {
				case "FWS":
					break;
				case "CWS":
					var data = ZLib.decompress(swfData, uncompressedLength, 8);
					byte_input = new ByteInput(data);
					byte_input.setOffset(8, 0);
					break;
				case "ZWS":
					byte_input = new ByteInput(LZMA.decompress(new Uint8Array(swfData), uncompressedLength).buffer);
					byte_input.setOffset(8, 0);
					break;
				default:
					throw new Error("this data is not swf.");
			}
			var reader = new SwfInput(byte_input, version);
			var stageSize = reader.rect();
			var frameRate = byte_input.readFixed8();
			var numFrames = byte_input.readUint16();
			var header = {
				compression,
				version,
				stageSize,
				frameRate,
				numFrames,
			};
			var dataStream = byte_input.extract(byte_input.length - byte_input.position);
			var tag = reader.parseTag();
			var fileAttributes;
			if (tag.tagcode == 69) {
				fileAttributes = tag;
				tag = reader.parseTag();
			} else {
				fileAttributes = {
					useDirectBlit: 0,
					useGPU: 0,
					hasMetadata: 0,
					isActionScript3: 0,
					useNetworkSandbox: 0,
				};
			}
			var backgroundColor = [255, 255, 255, 1];
			for (let i = 0; i < 2; i++) {
				if (tag.tagcode == 9) backgroundColor = tag.rgb;
				tag = reader.parseTag();
			}
			return {
				header: {
					header,
					fileAttributes,
					backgroundColor,
					uncompressedLength,
				},
				dataStream,
			};
		}
		emitMessage(message, type) {
			switch (type) {
				case "warn":
					console.log("WARN:" + message);
					break;
				case "error":
					console.log("ERROR:" + message);
					break;
			}
			return "unknown";
		}
		parseTags() {
			var tags = [];
			while (true) {
				var tag = this.parseTag();
				if (tag.tagcode == 0) break;
				tags.push(tag);
			}
			return tags;
		}
		parseTag() {
			var { tagcode, length } = this.parseTagCodeLength();
			var result = this.parseTagWithCode(tagcode, length);
			result.tagcode = tagcode;
			return result;
		}
		parseTagCodeLength() {
			var tagCodeAndLength = this.input.readUint16();
			var tagcode = tagCodeAndLength >> 6;
			var length = tagCodeAndLength & 0b111111;
			if (length == 0b111111) length = this.input.readUint32();
			return { tagcode, length };
		}
		parseTagWithCode(tagType, length) {
			var tagReader = new SwfInput(this.input.extract(length), this._swfVersion);
			this.input.position += length;
			var byte_input = tagReader.input;
			var obj = {};
			switch (tagType) {
				case 0:
				case 1:
					break;
				case 2:
					obj = tagReader.parseDefineShape(1);
					break;
				case 22:
					obj = tagReader.parseDefineShape(2);
					break;
				case 32:
					obj = tagReader.parseDefineShape(3);
					break;
				case 83:
					obj = tagReader.parseDefineShape(4);
					break;
				case 6:
					obj = tagReader.parseDefineBits(1, length);
					break;
				case 21:
					obj = tagReader.parseDefineBits(2, length);
					break;
				case 35:
					obj = tagReader.parseDefineBits(3, length);
					break;
				case 90:
					obj = tagReader.parseDefineBits(4, length);
					break;
				case 7:
					obj = tagReader.parseDefineButton(1, length);
					break;
				case 34:
					obj = tagReader.parseDefineButton(2, length);
					break;
				case 10:
					obj = tagReader.parseDefineFont1(length);
					break;
				case 48:
					obj = tagReader.parseDefineFont2(2, length);
					break;
				case 75:
					obj = tagReader.parseDefineFont2(3, length);
					break;
				case 91:
					obj = tagReader.parseDefineFont4(length);
					break;
				case 11:
					obj = tagReader.parseDefineText(1);
					break;
				case 33:
					obj = tagReader.parseDefineText(2);
					break;
				case 13:
					obj = tagReader.parseDefineFontInfo(1, length);
					break;
				case 62:
					obj = tagReader.parseDefineFontInfo(2, length);
					break;
				case 14:
					obj = tagReader.parseDefineSound(length);
					break;
				case 17:
					obj = tagReader.parseDefineButtonSound();
					break;
				case 20:
					obj = tagReader.parseDefineBitsLossLess(1, length);
					break;
				case 36:
					obj = tagReader.parseDefineBitsLossLess(2, length);
					break;
				case 23:
					obj = tagReader.parseDefineButtonCxform(length);
					break;
				case 37:
					obj = tagReader.parseDefineEditText();
					break;
				case 39:
					obj = tagReader.parseDefineSprite();
					break;
				case 46:
					obj = tagReader.parseDefineMorphShape(1);
					break;
				case 84:
					obj = tagReader.parseDefineMorphShape(2);
					break;
				case 60:
					obj = tagReader.parseDefineVideoStream();
					break;
				case 73:
					obj = tagReader.parseDefineFontAlignZones(length);
					break;
				case 78:
					obj = tagReader.parseDefineScalingGrid();
					break;
				case 86:
					obj = tagReader.parseDefineSceneAndFrameLabelData();
					break;
				case 87:
					obj = tagReader.parseDefineBinaryData(length);
					break;
				case 88:
					obj = tagReader.parseDefineFontName();
					break;
				case 4:
					obj = tagReader.parsePlaceObject(1, length);
					break;
				case 26:
					obj = tagReader.parsePlaceObject(2, length);
					break;
				case 70:
					obj = tagReader.parsePlaceObject(3, length);
					break;
				case 94:
					obj = tagReader.parsePlaceObject(4, length);
					break;
				case 5:
					obj = tagReader.parseRemoveObject(1);
					break;
				case 28:
					obj = tagReader.parseRemoveObject(2);
					break;
				case 8:
					obj.jpegtable = byte_input.readBytes(length);
					break;
				case 9:
					obj.rgb = tagReader.rgb();
					break;
				case 12:
					obj = tagReader.parseDoAction(length);
					break;
				case 15:
					obj = tagReader.parseStartSound(1);
					break;
				case 89:
					obj = tagReader.parseStartSound(2);
					break;
				case 18:
					obj = tagReader.parseSoundStreamHead(1);
					break;
				case 45:
					obj = tagReader.parseSoundStreamHead(2);
					break;
				case 19:
					obj = tagReader.parseSoundStreamBlock(length);
					break;
				case 24:
					if (length > 0) {
						byte_input.readUint16();
						obj.data = byte_input.readBytes(length - 2);
					}
					break;
				case 40:
					obj = tagReader.parseNameCharacter();
					break;
				case 41:
					obj = tagReader.parseProductInfo();
					break;
				case 43:
					obj = tagReader.parseFrameLabel(length);
					break;
				case 56:
					obj = tagReader.parseExportAssets();
					break;
				case 57:
					obj = tagReader.parseImportAssets(1);
					break;
				case 71:
					obj = tagReader.parseImportAssets(2);
					break;
				case 58:
					obj.debugger = byte_input.readStringWithUntil();
					break;
				case 64:
					byte_input.readUint16();
					obj.debugger = byte_input.readStringWithUntil();
					break;
				case 59:
					obj = tagReader.parseDoInitAction(length);
					break;
				case 61:
					obj = tagReader.parseVideoFrame(length);
					break;
				case 63:
					obj = tagReader.parseDebugID(length);
					break;
				case 65:
					obj.maxRecursionDepth = byte_input.readUint16();
					obj.timeoutSeconds = byte_input.readUint16();
					break;
				case 66:
					obj.depth = byte_input.readUint16();
					obj.tabIndex = byte_input.readUint16();
					break;
				case 69:
					obj = tagReader.parseFileAttributes();
					break;
				case 72:
					obj = tagReader.parseDoABC(1, length);
					break;
				case 82:
					obj = tagReader.parseDoABC(2, length);
					break;
				case 74:
					obj = tagReader.parseCSMTextSettings();
					break;
				case 76:
					obj = tagReader.parseSymbolClass();
					break;
				case 77:
					obj.metadata = byte_input.readStringWithUntil();
					break;
				case 93:
					byte_input.readUint16();
					if (length > 2) {
						obj.passwordHash = byte_input.readBytes(32);
					}
					break;
				case 3: // FreeCharacter
				case 16: // StopSound
				case 25: // PathsArePostScript
				case 29: // SyncFrame
				case 31: // FreeAll
				case 38: // DefineVideo
				case 42: // DefineTextFormat
				case 44: // DefineBehavior
				case 47: // FrameTag
				case 49: // GeProSet
				case 50: // DefineCommandObject
				case 51: // CharacterSet
				case 52: // FontRef
				case 53: // DefineFunction
				case 54: // PlaceFunction
				case 55: // GenTagObject
					console.log("[base] tagType -> " + tagType);
					break;
				case 27: // 27 (invalid)
				case 30: // 30 (invalid)
				case 67: // 67 (invalid)
				case 68: // 68 (invalid)
				case 79: // 79 (invalid)
				case 80: // 80 (invalid)
				case 81: // 81 (invalid)
				case 85: // 85 (invalid)
				case 92: // 92 (invalid)
					break;
				default: // null
					break;
			}
			return obj;
		}
		//////// color rect matrix ////////
		rect() {
			const byte_input = this.input;
			byte_input.byteAlign();
			var nBits = byte_input.readUB(5);
			const obj = {};
			obj.xMin = byte_input.readSB(nBits);
			obj.xMax = byte_input.readSB(nBits);
			obj.yMin = byte_input.readSB(nBits);
			obj.yMax = byte_input.readSB(nBits);
			return obj;
		}
		rgb() {
			const byte_input = this.input;
			return [byte_input.readUint8(), byte_input.readUint8(), byte_input.readUint8(), 1];
		}
		rgba() {
			const byte_input = this.input;
			return [byte_input.readUint8(), byte_input.readUint8(), byte_input.readUint8(), byte_input.readUint8() / 255];
		}
		colorTransform(hasAlpha) {
			const byte_input = this.input;
			byte_input.byteAlign();
			var result = [1, 1, 1, 1, 0, 0, 0, 0];
			var first6bits = byte_input.readUB(6);
			var hasAddTerms = first6bits >> 5;
			var hasMultiTerms = (first6bits >> 4) & 1;
			var nbits = first6bits & 0x0f;
			if (hasMultiTerms) {
				result[0] = byte_input.readSBFixed8(nbits);
				result[1] = byte_input.readSBFixed8(nbits);
				result[2] = byte_input.readSBFixed8(nbits);
				if (hasAlpha) {
					result[3] = byte_input.readSBFixed8(nbits);
				}
			}
			if (hasAddTerms) {
				result[4] = byte_input.readSB(nbits);
				result[5] = byte_input.readSB(nbits);
				result[6] = byte_input.readSB(nbits);
				if (hasAlpha) {
					result[7] = byte_input.readSB(nbits);
				}
			}
			return result;
		}
		matrix() {
			const byte_input = this.input;
			byte_input.byteAlign();
			var result = [1, 0, 0, 1, 0, 0];
			if (byte_input.readUB(1)) {
				var nScaleBits = byte_input.readUB(5);
				result[0] = byte_input.readSBFixed16(nScaleBits);
				result[3] = byte_input.readSBFixed16(nScaleBits);
			}
			if (byte_input.readUB(1)) {
				var nRotateBits = byte_input.readUB(5);
				result[1] = byte_input.readSBFixed16(nRotateBits);
				result[2] = byte_input.readSBFixed16(nRotateBits);
			}
			var nTranslateBits = byte_input.readUB(5);
			result[4] = byte_input.readSB(nTranslateBits);
			result[5] = byte_input.readSB(nTranslateBits);
			return result;
		}
		//////// Structure ////////
		//////// Shapes ////////
		fillStyleArray(shapeVersion) {
			const byte_input = this.input;
			var count = byte_input.readUint8();
			if (shapeVersion >= 2 && count == 0xff) count = byte_input.readUint16();
			var fillStyles = [];
			while (count--) {
				fillStyles.push(this.fillStyle(shapeVersion));
			}
			return fillStyles;
		}
		gradient(shapeVersion) {
			const byte_input = this.input;
			var matrix = this.matrix();
			var flags = byte_input.readUint8();
			var spreadMode = (flags >> 6) & 0b11;
			var interpolationMode = (flags >> 4) & 0b11;
			var numGradients = flags & 0b1111;
			var gradientRecords = [];
			for (var i = numGradients; i--;) {
				var ratio = byte_input.readUint8() / 255;
				var color = shapeVersion >= 3 ? this.rgba() : this.rgb();
				gradientRecords.push({ ratio, color });
			}
			return {
				spreadMode,
				interpolationMode,
				gradientRecords,
				matrix: matrix,
			};
		}
		fillStyle(shapeVersion) {
			const byte_input = this.input;
			const obj = {};
			var bitType = byte_input.readUint8();
			obj.type = bitType;
			switch (bitType) {
				case 0x00:
					if (shapeVersion >= 3) obj.color = this.rgba();
					else obj.color = this.rgb();
					break;
				case 0x10:
					obj.linearGradient = this.gradient(shapeVersion);
					break;
				case 0x12:
					obj.radialGradient = this.gradient(shapeVersion);
					break;
				case 0x13:
					obj.gradient = this.gradient(shapeVersion);
					obj.focalPoint = byte_input.readFixed8();
					break;
				case 0x40:
				case 0x41:
				case 0x42:
				case 0x43:
					obj.bitmapId = byte_input.readUint16();
					obj.bitmapMatrix = this.matrix();
					obj.isSmoothed = this._swfVersion >= 8 && (bitType & 0b10) == 0;
					obj.isRepeating = (bitType & 0b01) == 0;
					break;
				default:
					this.emitMessage("Invalid fill style: " + bitType, "error");
					break;
			}
			return obj;
		}
		lineStyleArray(shapeVersion) {
			const byte_input = this.input;
			var count = byte_input.readUint8();
			if (shapeVersion >= 2 && count === 0xff) count = byte_input.readUint16();
			var lineStyles = [];
			while (count--) lineStyles.push(this.lineStyles(shapeVersion));
			return lineStyles;
		}
		lineStyles(shapeVersion) {
			const byte_input = this.input;
			const obj = {};
			obj.width = byte_input.readUint16();
			if (shapeVersion == 4) {
				obj.startCapStyle = byte_input.readUB(2);
				obj.joinStyle = byte_input.readUB(2);
				obj.hasFill = byte_input.readUB(1);
				obj.noHScale = byte_input.readUB(1);
				obj.noVScale = byte_input.readUB(1);
				obj.pixelHinting = byte_input.readUB(1);
				byte_input.readUB(5);
				obj.noClose = byte_input.readUB(1);
				obj.endCapStyle = byte_input.readUB(2);
				if (obj.joinStyle === 2) obj.miterLimitFactor = byte_input.readFixed8();
				if (obj.hasFill) obj.fillType = this.fillStyle(shapeVersion);
				else obj.color = this.rgba();
			} else {
				obj.color = shapeVersion >= 3 ? this.rgba() : this.rgb();
			}
			return obj;
		}
		shapeRecords(shapeVersion, currentNumBits) {
			const byte_input = this.input;
			const shapeRecords = [];
			while (true) {
				var first6Bits = byte_input.readUB(6);
				var shape = null;
				if (first6Bits & 0x20) {
					var numBits = first6Bits & 0b1111;
					if (first6Bits & 0x10) {
						shape = this.straightEdgeRecord(numBits);
					} else {
						shape = this.curvedEdgeRecord(numBits);
					}
				} else {
					if (first6Bits) shape = this.styleChangeRecord(shapeVersion, first6Bits, currentNumBits);
				}
				if (!shape) {
					byte_input.byteAlign();
					break;
				} else {
					shapeRecords.push(shape);
				}
			}
			return shapeRecords;
		}
		straightEdgeRecord(numBits) {
			const byte_input = this.input;
			var deltaX = 0;
			var deltaY = 0;
			var GeneralLineFlag = byte_input.readUB(1);
			if (GeneralLineFlag) {
				deltaX = byte_input.readSB(numBits + 2);
				deltaY = byte_input.readSB(numBits + 2);
			} else {
				var VertLineFlag = byte_input.readUB(1);
				if (VertLineFlag) {
					deltaX = 0;
					deltaY = byte_input.readSB(numBits + 2);
				} else {
					deltaX = byte_input.readSB(numBits + 2);
					deltaY = 0;
				}
			}
			return {
				deltaX,
				deltaY,
				isCurved: false,
				isChange: false,
			};
		}
		curvedEdgeRecord(numBits) {
			const byte_input = this.input;
			var controlDeltaX = byte_input.readSB(numBits + 2);
			var controlDeltaY = byte_input.readSB(numBits + 2);
			var anchorDeltaX = byte_input.readSB(numBits + 2);
			var anchorDeltaY = byte_input.readSB(numBits + 2);
			return {
				controlDeltaX,
				controlDeltaY,
				anchorDeltaX,
				anchorDeltaY,
				isCurved: true,
				isChange: false,
			};
		}
		styleChangeRecord(shapeVersion, changeFlag, currentNumBits) {
			const byte_input = this.input;
			const obj = {};
			obj.stateMoveTo = changeFlag & 1;
			obj.stateFillStyle0 = (changeFlag >> 1) & 1;
			obj.stateFillStyle1 = (changeFlag >> 2) & 1;
			obj.stateLineStyle = (changeFlag >> 3) & 1;
			obj.stateNewStyles = (changeFlag >> 4) & 1;
			if (obj.stateMoveTo) {
				var moveBits = byte_input.readUB(5);
				obj.moveX = byte_input.readSB(moveBits);
				obj.moveY = byte_input.readSB(moveBits);
			}
			obj.fillStyle0 = 0;
			if (obj.stateFillStyle0)
				obj.fillStyle0 = byte_input.readUB(currentNumBits.fillBits);
			obj.fillStyle1 = 0;
			if (obj.stateFillStyle1)
				obj.fillStyle1 = byte_input.readUB(currentNumBits.fillBits);
			obj.lineStyle = 0;
			if (obj.stateLineStyle)
				obj.lineStyle = byte_input.readUB(currentNumBits.lineBits);
			if (obj.stateNewStyles) {
				obj.fillStyles = this.fillStyleArray(shapeVersion);
				obj.lineStyles = this.lineStyleArray(shapeVersion);
				var numBits = byte_input.readUint8();
				currentNumBits.fillBits = obj.numFillBits = numBits >> 4;
				currentNumBits.lineBits = obj.numLineBits = numBits & 0b1111;
			}
			obj.isChange = true;
			return obj;
		}
		morphFillStyleArray(shapeVersion) {
			const byte_input = this.input;
			var fillStyleCount = byte_input.readUint8();
			if (shapeVersion >= 2 && fillStyleCount == 0xff)
				fillStyleCount = byte_input.readUint16();
			var fillStyles = [];
			for (var i = fillStyleCount; i--;)
				fillStyles.push(this.morphFillStyle());
			return fillStyles;
		}
		morphFillStyle() {
			const byte_input = this.input;
			const obj = {};
			var bitType = byte_input.readUint8();
			obj.type = bitType;
			switch (bitType) {
				case 0x00:
					obj.startColor = this.rgba();
					obj.endColor = this.rgba();
					break;
				case 0x10:
					obj.linearGradient = this.morphGradient();
					break;
				case 0x12:
					obj.radialGradient = this.morphGradient();
					break;
				case 0x13:
					obj.gradient = this.morphGradient();
					obj.startFocalPoint = byte_input.readFixed8();
					obj.endFocalPoint = byte_input.readFixed8();
					break;
				case 0x40:
				case 0x41:
				case 0x42:
				case 0x43:
					obj.bitmapId = byte_input.readUint16();
					obj.bitmapStartMatrix = this.matrix();
					obj.bitmapEndMatrix = this.matrix();
					obj.isSmoothed = (bitType & 0b10) == 0;
					obj.isRepeating = (bitType & 0b01) == 0;
					break;
				default:
					this.emitMessage("Invalid fill style: " + bitType, "error");
			}
			return obj;
		}
		morphGradient() {
			const obj = {};
			const byte_input = this.input;
			obj.startMatrix = this.matrix();
			obj.endMatrix = this.matrix();
			var flags = byte_input.readUint8();
			obj.spreadMode = (flags >> 6) & 0b11;
			obj.interpolationMode = (flags >> 4) & 0b11;
			var numGradients = flags & 0b1111;
			var gradientRecords = [];
			for (var i = numGradients; i--;) {
				gradientRecords.push({
					startRatio: byte_input.readUint8() / 255,
					startColor: this.rgba(),
					endRatio: byte_input.readUint8() / 255,
					endColor: this.rgba(),
				});
			}
			obj.gradientRecords = gradientRecords;
			return obj;
		}
		morphLineStyleArray(shapeVersion) {
			const byte_input = this.input;
			var lineStyleCount = byte_input.readUint8();
			if (shapeVersion >= 2 && lineStyleCount == 0xff)
				lineStyleCount = byte_input.readUint16();
			const lineStyles = [];
			for (var i = lineStyleCount; i--;)
				lineStyles.push(this.morphLineStyle(shapeVersion));
			return lineStyles;
		}
		morphLineStyle(shapeVersion) {
			const byte_input = this.input;
			const obj = {};
			obj.startWidth = byte_input.readUint16();
			obj.endWidth = byte_input.readUint16();
			if (shapeVersion < 2) {
				obj.startColor = this.rgba();
				obj.endColor = this.rgba();
			} else {
				obj.startCapStyle = byte_input.readUB(2);
				obj.joinStyle = byte_input.readUB(2);
				obj.hasFill = byte_input.readUB(1);
				obj.noHScale = byte_input.readUB(1);
				obj.noVScale = byte_input.readUB(1);
				obj.pixelHinting = byte_input.readUB(1);
				byte_input.readUB(5);
				obj.noClose = byte_input.readUB(1);
				obj.endCapStyle = byte_input.readUB(2);
				if (obj.joinStyle === 2) obj.miterLimitFactor = byte_input.readFixed8();
				if (obj.hasFill) {
					obj.fillType = this.morphFillStyle();
				} else {
					obj.startColor = this.rgba();
					obj.endColor = this.rgba();
				}
			}
			return obj;
		}
		morphShapeWithStyle(shapeVersion, t) {
			const byte_input = this.input;
			var numBits = byte_input.readUint8();
			var NumFillBits = numBits >> 4;
			var NumLineBits = numBits & 0b1111;
			if (t) (NumFillBits = 0), (NumLineBits = 0);
			var ShapeRecords = this.shapeRecords(shapeVersion, {
				fillBits: NumFillBits,
				lineBits: NumLineBits,
			});
			return ShapeRecords;
		}
		//////// Font Text ////////
		getTextRecords(ver, GlyphBits, AdvanceBits) {
			const byte_input = this.input;
			var array = [];
			while (true) {
				var flags = byte_input.readUint8();
				if (flags == 0) break;
				const obj = {};
				if (flags & 0b1000) obj.fontId = byte_input.readUint16();
				if (flags & 0b100) obj.textColor = ver === 1 ? this.rgb() : this.rgba();
				if (flags & 0b1) obj.XOffset = byte_input.readInt16();
				if (flags & 0b10) obj.YOffset = byte_input.readInt16();
				if (flags & 0b1000) obj.textHeight = byte_input.readUint16();
				obj.glyphEntries = this.getGlyphEntries(GlyphBits, AdvanceBits);
				array.push(obj);
			}
			return array;
		}
		getGlyphEntries(GlyphBits, AdvanceBits) {
			const byte_input = this.input;
			var count = byte_input.readUint8();
			var array = [];
			while (count--)
				array.push({
					index: byte_input.readUB(GlyphBits),
					advance: byte_input.readSB(AdvanceBits),
				});
			return array;
		}
		buttonRecords(ver) {
			var records = [];
			const byte_input = this.input;
			while (true) {
				var flags = byte_input.readUint8();
				if (flags == 0) break;
				const obj = {};
				obj.buttonStateUp = flags & 1;
				obj.buttonStateOver = (flags >>> 1) & 1;
				obj.buttonStateDown = (flags >>> 2) & 1;
				obj.buttonStateHitTest = (flags >>> 3) & 1;
				obj.characterId = byte_input.readUint16();
				obj.depth = byte_input.readUint16();
				obj.matrix = this.matrix();
				if (ver == 2) obj.colorTransform = this.colorTransform(true);
				if (flags & 16) obj.filters = this.getFilterList();
				if (flags & 32) obj.blendMode = byte_input.readUint8();
				records.push(obj);
			}
			return records;
		}
		buttonActions(endOffset) {
			const byte_input = this.input;
			var results = [];
			while (true) {
				const obj = {};
				var condActionSize = byte_input.readUint16();
				var flags = byte_input.readUint16();
				obj.condIdleToOverUp = flags & 1;
				obj.condOverUpToIdle = (flags >>> 1) & 1;
				obj.condOverUpToOverDown = (flags >>> 2) & 1;
				obj.condOverDownToOverUp = (flags >>> 3) & 1;
				obj.condOverDownToOutDown = (flags >>> 4) & 1;
				obj.condOutDownToOverDown = (flags >>> 5) & 1;
				obj.condOutDownToIdle = (flags >>> 6) & 1;
				obj.condIdleToOverDown = (flags >>> 7) & 1;
				obj.condOverDownToIdle = (flags >>> 8) & 1;
				obj.condKeyPress = flags >> 9;
				byte_input.byteAlign();
				if (condActionSize >= 4) {
					obj.actionScript = byte_input.readBytes(condActionSize - 4);
				} else if (condActionSize == 0) {
					obj.actionScript = byte_input.readBytes(endOffset - byte_input.position);
				}
				results.push(obj);
				if (condActionSize == 0) break;
				if (byte_input.position > endOffset) break;
			}
			return results;
		}
		parseSoundFormat() {
			const byte_input = this.input;
			const obj = {};
			var frags = byte_input.readUint8();
			obj.compression = SwfTypes.sound.compression[frags >> 4] || this.emitMessage("Invalid audio format", "error");
			obj.sampleRate = SwfTypes.sound.sampleRate[(frags & 0b1100) >> 2];
			obj.is16Bit = frags & 0b10;
			obj.isStereo = frags & 0b1;
			return obj;
		}
		parseClipActions(startOffset, length) {
			const byte_input = this.input;
			byte_input.readUint16();
			var allEventFlags = this.parseClipEventFlags();
			var endLength = startOffset + length;
			var actionRecords = [];
			while (byte_input.position < endLength) {
				var clipActionRecord = this.parseClipActionRecord(endLength);
				actionRecords.push(clipActionRecord);
				if (endLength <= byte_input.position) break;
				var endFlag = this._swfVersion <= 5 ? byte_input.readUint16() : byte_input.readUint32();
				if (!endFlag) break;
				if (this._swfVersion <= 5) byte_input.position -= 2;
				else byte_input.position -= 4;
				if (clipActionRecord.keyCode) byte_input.position -= 1;
			}
			return { allEventFlags, actionRecords };
		}
		parseClipActionRecord(endLength) {
			const byte_input = this.input;
			const obj = {};
			var eventFlags = this.parseClipEventFlags();
			if (endLength > byte_input.position) {
				var ActionRecordSize = byte_input.readUint32();
				if (eventFlags.keyPress) obj.keyCode = byte_input.readUint8();
				obj.eventFlags = eventFlags;
				obj.actions = byte_input.readBytes(ActionRecordSize);
			}
			return obj;
		}
		parseClipEventFlags() {
			const obj = {};
			const byte_input = this.input;
			obj.keyUp = byte_input.readUB(1);
			obj.keyDown = byte_input.readUB(1);
			obj.mouseUp = byte_input.readUB(1);
			obj.mouseDown = byte_input.readUB(1);
			obj.mouseMove = byte_input.readUB(1);
			obj.unload = byte_input.readUB(1);
			obj.enterFrame = byte_input.readUB(1);
			obj.load = byte_input.readUB(1);
			if (this._swfVersion >= 6) {
				obj.dragOver = byte_input.readUB(1);
				obj.rollOut = byte_input.readUB(1);
				obj.rollOver = byte_input.readUB(1);
				obj.releaseOutside = byte_input.readUB(1);
				obj.release = byte_input.readUB(1);
				obj.press = byte_input.readUB(1);
				obj.initialize = byte_input.readUB(1);
			}
			obj.data = byte_input.readUB(1);
			if (this._swfVersion >= 6) {
				byte_input.readUB(5);
				obj.construct = byte_input.readUB(1);
				obj.keyPress = byte_input.readUB(1);
				obj.dragOut = byte_input.readUB(1);
				byte_input.readUB(8);
			}
			byte_input.byteAlign();
			return obj;
		}
		getFilterList() {
			const byte_input = this.input;
			const result = [];
			var numberOfFilters = byte_input.readUint8();
			while (numberOfFilters--) {
				result.push(this.getFilter());
			}
			return result;
		}
		getFilter() {
			const byte_input = this.input;
			var filterId = byte_input.readUint8();
			var filter;
			switch (filterId) {
				case 0:
					filter = this.dropShadowFilter();
					break;
				case 1:
					filter = this.blurFilter();
					break;
				case 2:
					filter = this.glowFilter();
					break;
				case 3:
					filter = this.bevelFilter();
					break;
				case 4:
					filter = this.gradientGlowFilter();
					break;
				case 5:
					filter = this.convolutionFilter();
					break;
				case 6:
					filter = this.colorMatrixFilter();
					break;
				case 7:
					filter = this.gradientBevelFilter();
					break;
				default:
					this.emitMessage("Invalid filter type: " + filterId, "error");
			}
			return { filterId, filter };
		}
		dropShadowFilter() {
			const byte_input = this.input;
			var rgba = this.rgba();
			var alpha = rgba[3];
			var color = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
			var blurX = byte_input.readFixed16();
			var blurY = byte_input.readFixed16();
			var angle = (byte_input.readFixed16() * 180) / Math.PI;
			var distance = byte_input.readFixed16();
			var strength = byte_input.readFloat16() / 256;
			var inner = byte_input.readUB(1) ? true : false;
			var knockout = byte_input.readUB(1) ? true : false;
			var hideObject = byte_input.readUB(1) ? false : true;
			var quality = byte_input.readUB(5);
			if (!strength) return null;
			return {
				distance,
				angle,
				color,
				alpha,
				blurX,
				blurY,
				strength,
				quality,
				inner,
				knockout,
				hideObject,
			};
		}
		blurFilter() {
			const byte_input = this.input;
			var blurX = byte_input.readFixed16();
			var blurY = byte_input.readFixed16();
			var quality = byte_input.readUB(5);
			byte_input.readUB(3);
			return { blurX, blurY, quality };
		}
		glowFilter() {
			const byte_input = this.input;
			var rgba = this.rgba();
			var alpha = rgba[3];
			var color = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
			var blurX = byte_input.readFixed16();
			var blurY = byte_input.readFixed16();
			var strength = byte_input.readFloat16() / 256;
			var inner = byte_input.readUB(1) ? true : false;
			var knockout = byte_input.readUB(1) ? true : false;
			byte_input.readUB(1);
			var quality = byte_input.readUB(5);
			if (!strength) return null;
			return { color, alpha, blurX, blurY, strength, quality, inner, knockout };
		}
		bevelFilter() {
			const byte_input = this.input;
			var rgba;
			rgba = this.rgba();
			var highlightAlpha = rgba[3];
			var highlightColor = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
			rgba = this.rgba();
			var shadowAlpha = rgba[3];
			var shadowColor = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
			var blurX = byte_input.readFixed16();
			var blurY = byte_input.readFixed16();
			var angle = (byte_input.readFixed16() * 180) / Math.PI;
			var distance = byte_input.readFixed16();
			var strength = byte_input.readFloat16() / 256;
			var inner = byte_input.readUB(1) ? true : false;
			var knockout = byte_input.readUB(1) ? true : false;
			byte_input.readUB(1);
			var OnTop = byte_input.readUB(1);
			var quality = byte_input.readUB(4);
			var type = "inner";
			if (!inner) {
				if (OnTop) type = "full";
				else type = "outer";
			}
			if (!strength) return null;
			return {
				distance,
				angle,
				highlightColor,
				highlightAlpha,
				shadowColor,
				shadowAlpha,
				blurX,
				blurY,
				strength,
				quality,
				type,
				knockout,
			};
		}
		gradientGlowFilter() {
			const byte_input = this.input;
			var i;
			var numColors = byte_input.readUint8();
			var colors = [];
			var alphas = [];
			for (i = 0; i < numColors; i++) {
				var rgba = this.rgba();
				alphas[alphas.length] = rgba[3];
				colors[colors.length] = (rgba[0] << 16) | (rgba[1] << 8) | rgba[2];
			}
			var ratios = [];
			for (i = 0; i < numColors; i++)
				ratios[ratios.length] = byte_input.readUint8();
			var blurX = byte_input.readFixed16();
			var blurY = byte_input.readFixed16();
			var angle = (byte_input.readFixed16() * 180) / Math.PI;
			var distance = byte_input.readFixed16();
			var strength = byte_input.readFloat16() / 256;
			var inner = byte_input.readUB(1) ? true : false;
			var knockout = byte_input.readUB(1) ? true : false;
			byte_input.readUB(1);
			var onTop = byte_input.readUB(1);
			var quality = byte_input.readUB(4);
			var type = "inner";
			if (!inner) {
				if (onTop) {
					type = "full";
				} else {
					type = "outer";
				}
			}
			if (!strength) return null;
			return {
				distance,
				angle,
				colors,
				alphas,
				ratios,
				blurX,
				blurY,
				strength,
				quality,
				type,
				knockout,
			};
		}
		convolutionFilter() {
			const byte_input = this.input;
			const obj = {};
			obj.matrixX = byte_input.readUint8();
			obj.matrixY = byte_input.readUint8();
			obj.divisor = byte_input.readFloat16() | byte_input.readFloat16();
			obj.bias = byte_input.readFloat16() | byte_input.readFloat16();
			var count = obj.matrixX * obj.matrixY;
			var matrixArr = [];
			while (count--) matrixArr.push(byte_input.readUint32());
			obj.defaultColor = this.rgba();
			byte_input.readUB(6);
			obj.clamp = byte_input.readUB(1);
			obj.preserveAlpha = byte_input.readUB(1);
			return obj;
		}
		gradientBevelFilter() {
			const byte_input = this.input;
			var NumColors = byte_input.readUint8();
			var i;
			var colors = [];
			var alphas = [];
			for (i = 0; i < NumColors; i++) {
				var rgba = this.rgba();
				alphas.push(rgba[3]);
				colors.push((rgba[0] << 16) | (rgba[1] << 8) | rgba[2]);
			}
			var ratios = [];
			for (i = 0; i < NumColors; i++)
				ratios[ratios.length] = byte_input.readUint8();
			var blurX = byte_input.readFixed16();
			var blurY = byte_input.readFixed16();
			var angle = (byte_input.readFixed16() * 180) / Math.PI;
			var distance = byte_input.readFixed16();
			var strength = byte_input.readFloat16() / 256;
			var inner = byte_input.readUB(1) ? true : false;
			var knockout = byte_input.readUB(1) ? true : false;
			byte_input.readUB(1);
			var OnTop = byte_input.readUB(1);
			var quality = byte_input.readUB(4);
			var type = "inner";
			if (!inner) {
				if (OnTop) type = "full";
				else type = "outer";
			}
			if (!strength) {
				return null;
			}
			return {
				distance,
				angle,
				colors,
				alphas,
				ratios,
				blurX,
				blurY,
				strength,
				quality,
				type,
				knockout,
			};
		}
		colorMatrixFilter() {
			const byte_input = this.input;
			var matrixArr = [];
			for (var i = 0; i < 20; i++) matrixArr.push(byte_input.readUint32());
			return matrixArr;
		}
		parseSoundInfo() {
			const obj = {};
			const byte_input = this.input;
			var flags = byte_input.readUint8();
			switch ((flags >> 4) & 0b11) {
				case 0:
					obj.event = "event";
					break;
				case 1:
					obj.event = "start";
					break;
				case 2:
					obj.event = "stop";
					break;
			}
			if (flags & 0b1) obj.inSample = byte_input.readUint32();
			if (flags & 0b10) obj.outSample = byte_input.readUint32();
			if (flags & 0b100) obj.numLoops = byte_input.readUint16();
			if (flags & 0b1000) {
				var count = byte_input.readUint8();
				var envelope = [];
				while (count--) {
					envelope.push({
						sample: byte_input.readUint32(),
						leftVolume: byte_input.readUint16(),
						rightVolume: byte_input.readUint16(),
					});
				}
				obj.envelope = envelope;
			}
			return obj;
		}
		//////// Define ////////
		parseDefineButton(ver, length) {
			const byte_input = this.input;
			const obj = {};
			var endOffset = byte_input.position + length;
			obj.id = byte_input.readUint16();
			var ActionOffset = 0;
			if (ver == 2) {
				obj.flag = byte_input.readUint8();
				obj.trackAsMenu = obj.flag & 0b1;
				ActionOffset = byte_input.readUint16();
			}
			obj.records = this.buttonRecords(ver);
			byte_input.byteAlign();
			if (ver === 1) {
				obj.actions = byte_input.readBytes(endOffset - byte_input.position);
			} else {
				if (ActionOffset > 0) {
					obj.actions = this.buttonActions(endOffset);
				}
			}
			byte_input.byteAlign();
			return obj;
		}
		parseDefineButtonSound() {
			const byte_input = this.input;
			const obj = {};
			obj.buttonId = byte_input.readUint16();
			for (var i = 0; i < 4; i++) {
				var soundId = byte_input.readUint16();
				if (soundId) {
					var soundInfo = this.parseSoundInfo();
					switch (i) {
						case 0:
							obj.buttonStateUpSoundInfo = soundInfo;
							obj.buttonStateUpSoundId = soundId;
							break;
						case 1:
							obj.buttonStateOverSoundInfo = soundInfo;
							obj.buttonStateOverSoundId = soundId;
							break;
						case 2:
							obj.buttonStateDownSoundInfo = soundInfo;
							obj.buttonStateDownSoundId = soundId;
							break;
						case 3:
							obj.buttonStateHitTestSoundInfo = soundInfo;
							obj.buttonStateHitTestSoundId = soundId;
							break;
					}
				}
			}
			return obj;
		}
		parseDefineFont1(length) {
			const byte_input = this.input;
			const obj = {};
			obj.version = 1;
			var endOffset = byte_input.position + length;
			var i;
			obj.id = byte_input.readUint16();
			var offset = byte_input.position;
			var numGlyphs = byte_input.readUint16();
			var offsetTable = [];
			offsetTable.push(numGlyphs);
			numGlyphs /= 2;
			numGlyphs--;
			for (i = numGlyphs; i--;) offsetTable.push(byte_input.readUint16());
			numGlyphs++;
			var glyphs = [];
			for (i = 0; i < numGlyphs; i++) {
				byte_input.setOffset(offset + offsetTable[i], 0);
				var numBits = byte_input.readUint8();
				glyphs.push(this.shapeRecords(1, {
					fillBits: numBits >> 4,
					lineBits: numBits & 0b1111,
				}));
			}
			obj.glyphs = glyphs;
			byte_input.position = endOffset;
			byte_input.bit_offset = 0;
			return obj;
		}
		parseDefineFont2(ver, length) {
			const byte_input = this.input;
			var startOffset = byte_input.position;
			const obj = {};
			obj.version = ver;
			obj.id = byte_input.readUint16();
			var i = 0;
			var fontFlags = byte_input.readUint8();
			obj.isBold = fontFlags & 1;
			obj.isItalic = (fontFlags >>> 1) & 1;
			var isWideCodes = (fontFlags >>> 2) & 1;
			obj.isWideCodes = isWideCodes;
			var isWideOffsets = (fontFlags >>> 3) & 1;
			obj.isWideOffsets = isWideOffsets;
			obj.isANSI = (fontFlags >>> 4) & 1;
			obj.isSmallText = (fontFlags >>> 5) & 1;
			obj.isShiftJIS = (fontFlags >>> 6) & 1;
			var hasLayout = (fontFlags >>> 7) & 1;
			obj.languageCode = byte_input.readUint8();
			obj.fontNameData = byte_input.readStringWithLength();
			var numGlyphs = byte_input.readUint16();
			obj.numGlyphs = numGlyphs;
			if (numGlyphs == 0) {
				if (isWideOffsets) byte_input.readUint32();
				else byte_input.readUint16();
			} else {
				var offset = byte_input.position;
				var OffsetTable = [];
				if (isWideOffsets) {
					for (i = numGlyphs; i--;) {
						OffsetTable[OffsetTable.length] = byte_input.readUint32();
					}
				} else {
					for (i = numGlyphs; i--;) {
						OffsetTable[OffsetTable.length] = byte_input.readUint16();
					}
				}
				var codeTableOffset;
				if (isWideOffsets) {
					codeTableOffset = byte_input.readUint32();
				} else {
					codeTableOffset = byte_input.readUint16();
				}
				var glyphShapeTable = [];
				for (i = 0; i < numGlyphs; i++) {
					byte_input.setOffset(offset + OffsetTable[i], 0);
					var availableBytes;
					if (i < numGlyphs - 1) {
						availableBytes = OffsetTable[i + 1] - OffsetTable[i];
					} else {
						availableBytes = codeTableOffset - OffsetTable[i];
					}
					if (availableBytes == 0) continue;
					var numBits = byte_input.readUint8();
					if (availableBytes == 1) continue;
					var numFillBits = numBits >> 4;
					var numLineBits = numBits & 0b1111;
					glyphShapeTable.push(this.shapeRecords(1, {
						fillBits: numFillBits,
						lineBits: numLineBits,
					}));
				}
				obj.glyphs = glyphShapeTable;
				byte_input.setOffset(offset + codeTableOffset, 0);
				var CodeTable = [];
				if (isWideCodes) {
					for (i = numGlyphs; i--;) {
						CodeTable.push(byte_input.readUint16());
					}
				} else {
					for (i = numGlyphs; i--;) {
						CodeTable.push(byte_input.readUint8());
					}
				}
				obj.codeTables = CodeTable;
			}
			if (hasLayout) {
				obj.layout = {};
				obj.layout.ascent = byte_input.readUint16();
				obj.layout.descent = byte_input.readUint16();
				obj.layout.leading = byte_input.readInt16();
				var advanceTable = [];
				for (i = numGlyphs; i--;) {
					advanceTable.push(byte_input.readInt16());
				}
				obj.layout.advanceTable = advanceTable;
				var boundsTable = [];
				if (byte_input.position - startOffset < length) {
					for (i = numGlyphs; i--;) {
						boundsTable.push(this.rect());
					}
					byte_input.byteAlign();
				}
				obj.layout.boundsTable = boundsTable;
				var kernings = [];
				if (byte_input.position - startOffset < length) {
					var kerningCount = byte_input.readUint16();
					for (i = kerningCount; i--;) {
						var kerningCode1 = isWideCodes ? byte_input.readUint16() : byte_input.readUint8();
						var kerningCode2 = isWideCodes ? byte_input.readUint16() : byte_input.readUint8();
						var kerningAdjustment = byte_input.readInt16();
						kernings.push({
							leftCode: kerningCode1,
							rightCode: kerningCode2,
							adjustment: kerningAdjustment,
						});
					}
				}
				obj.kernings = kernings;
			}
			return obj;
		}
		parseDefineFont4(length) {
			const byte_input = this.input;
			var startOffset = byte_input.position;
			const obj = {};
			obj.version = 4;
			obj.id = byte_input.readUint16();
			var flags = byte_input.readUint8();
			obj.name = byte_input.readStringWithUntil();
			if (flags & 0b100) {
				obj.data = byte_input.readBytes(length - (byte_input.position - startOffset));
			} else {
				var e = length - (byte_input.position - startOffset);
				byte_input.position += e;
			}
			obj.isItalic = flags & 0b10;
			obj.isBold = flags & 0b1;
			return obj;
		}
		parseDefineFontInfo(ver, length) {
			const byte_input = this.input;
			var endOffset = byte_input.position + length;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.version = ver;
			obj.fontNameData = byte_input.readStringWithLength();
			var flags = byte_input.readUint8();
			obj.isWideCodes = flags & 1;
			obj.isBold = (flags >>> 1) & 1;
			obj.isItalic = (flags >>> 2) & 1;
			obj.isShiftJIS = (flags >>> 3) & 1;
			obj.isANSI = (flags >>> 4) & 1;
			obj.isSmallText = (flags >>> 5) & 1;
			byte_input.byteAlign();
			if (ver === 2) obj.languageCode = byte_input.readUint8();
			var codeTable = [];
			var tLen = endOffset - byte_input.position;
			if (obj.isWideCodes) {
				while (tLen > 1) {
					codeTable.push(byte_input.readUint16());
					tLen -= 2;
				}
			} else {
				while (tLen > 0) {
					codeTable.push(byte_input.readUint8());
					tLen--;
				}
			}
			obj.codeTable = codeTable;
			return obj;
		}
		parseDefineEditText() {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.bounds = this.rect();
			var flag1 = byte_input.readUint16();
			var hasFont = flag1 & 1;
			var hasMaxLength = (flag1 >>> 1) & 1;
			var hasTextColor = (flag1 >>> 2) & 1;
			var isReadOnly = (flag1 >>> 3) & 1;
			var isPassword = (flag1 >>> 4) & 1;
			var isMultiline = (flag1 >>> 5) & 1;
			var isWordWrap = (flag1 >>> 6) & 1;
			var hasInitialText = (flag1 >>> 7) & 1;
			var outlines = (flag1 >>> 8) & 1;
			var HTML = (flag1 >>> 9) & 1;
			var wasStatic = (flag1 >>> 10) & 1;
			var border = (flag1 >>> 11) & 1;
			var noSelect = (flag1 >>> 12) & 1;
			var hasLayout = (flag1 >>> 13) & 1;
			var autoSize = (flag1 >>> 14) & 1;
			var hasFontClass = (flag1 >>> 15) & 1;
			obj.isReadOnly = isReadOnly;
			obj.isPassword = isPassword;
			obj.isMultiline = isMultiline;
			obj.isWordWrap = isWordWrap;
			obj.outlines = outlines;
			obj.HTML = HTML;
			obj.wasStatic = wasStatic;
			obj.border = border;
			obj.noSelect = noSelect;
			obj.autoSize = autoSize;
			if (hasFont) obj.fontID = byte_input.readUint16();
			if (hasFontClass) obj.fontClass = byte_input.readStringWithUntil();
			if (hasFont && !hasFontClass) obj.fontHeight = byte_input.readUint16();
			if (hasTextColor) obj.textColor = this.rgba();
			if (hasMaxLength) obj.maxLength = byte_input.readUint16();
			if (hasLayout) {
				obj.layout = {};
				obj.layout.align = byte_input.readUint8();
				obj.layout.leftMargin = byte_input.readUint16();
				obj.layout.rightMargin = byte_input.readUint16();
				obj.layout.indent = byte_input.readUint16();
				obj.layout.leading = byte_input.readInt16();
			}
			obj.variableName = byte_input.readStringWithUntil();
			if (hasInitialText) obj.initialText = byte_input.readStringWithUntil();
			return obj;
		}
		parseDefineSprite() {
			const obj = {};
			const byte_input = this.input;
			obj.id = byte_input.readUint16();
			obj.numFrames = byte_input.readUint16();
			obj.tags = this.parseTags();
			return obj;
		}
		parseDefineShape(version) {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.bounds = this.rect();
			obj.version = version;
			if (version >= 4) {
				obj.edgeBounds = this.rect();
				var flags = byte_input.readUint8();
				obj.scalingStrokes = flags & 1;
				obj.nonScalingStrokes = (flags >>> 1) & 1;
				obj.fillWindingRule = (flags >>> 2) & 1;
			}
			obj.fillStyles = this.fillStyleArray(version);
			obj.lineStyles = this.lineStyleArray(version);
			var numBits = byte_input.readUint8();
			var numFillBits = numBits >> 4;
			var numLineBits = numBits & 0b1111;
			obj.shapeRecords = this.shapeRecords(version, {
				fillBits: numFillBits,
				lineBits: numLineBits,
			});
			obj.numFillBits = numFillBits;
			obj.numLineBits = numLineBits;
			return obj;
		}
		parseDefineSound(length) {
			const obj = {};
			const byte_input = this.input;
			var startOffset = byte_input.position;
			obj.id = byte_input.readUint16();
			obj.format = this.parseSoundFormat();
			obj.numSamples = byte_input.readUint32();
			var sub = byte_input.position - startOffset;
			var dataLength = length - sub;
			obj.data = byte_input.readBytes(dataLength);
			return obj;
		}
		parseDefineText(ver) {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.bounds = this.rect();
			obj.matrix = this.matrix();
			var GlyphBits = byte_input.readUint8();
			var AdvanceBits = byte_input.readUint8();
			obj.records = this.getTextRecords(ver, GlyphBits, AdvanceBits);
			return obj;
		}
		parseDefineBinaryData(length) {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			byte_input.readUint32();
			obj.data = byte_input.readBytes(length - 6);
			return obj;
		}
		parseDefineScalingGrid() {
			const byte_input = this.input;
			const obj = {};
			obj.characterId = byte_input.readUint16();
			obj.splitter = this.rect();
			byte_input.byteAlign();
			return obj;
		}
		parseDefineSceneAndFrameLabelData() {
			const byte_input = this.input;
			const obj = {};
			var sceneCount = byte_input.readEncodedU32();
			obj.sceneInfo = [];
			while (sceneCount--) {
				obj.sceneInfo.push({
					offset: byte_input.readEncodedU32(),
					name: byte_input.readStringWithUntil(),
				});
			}
			var frameLabelCount = byte_input.readEncodedU32();
			obj.frameInfo = [];
			while (frameLabelCount--) {
				obj.frameInfo.push({
					num: byte_input.readEncodedU32(),
					label: byte_input.readStringWithUntil(),
				});
			}
			return obj;
		}
		parseDefineVideoStream() {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.numFrames = byte_input.readUint16();
			obj.width = byte_input.readUint16();
			obj.height = byte_input.readUint16();
			var flags = byte_input.readUint8();
			obj.codec = SwfTypes.video.codec[byte_input.readUint8()] || this.emitMessage("Invalid video codec.", "error");
			obj.deblocking = SwfTypes.video.deblocking[(flags >> 1) & 0b111] || this.emitMessage("Invalid video deblocking value.", "error");
			obj.isSmoothed = flags & 0b1;
			return obj;
		}
		parseDefineBitsLossLess(ver, length) {
			const obj = {};
			const byte_input = this.input;
			var startOffset = byte_input.position;
			obj.id = byte_input.readUint16();
			obj.version = ver;
			var format = byte_input.readUint8();
			obj.width = byte_input.readUint16();
			obj.height = byte_input.readUint16();
			switch (format) {
				case 3: // ColorMap8
					obj.numColors = byte_input.readUint8();
					break;
				case 4: // Rgb15
				case 5: // Rgb32
					break;
				default:
					this.emitMessage("Invalid bitmap format: " + format, "error");
			}
			var sub = byte_input.position - startOffset;
			obj.data = byte_input.readBytes(length - sub);
			obj.format = format;
			return obj;
		}
		parseDefineFontName() {
			const obj = {};
			const byte_input = this.input;
			obj.id = byte_input.readUint16();
			obj.name = byte_input.readStringWithUntil();
			obj.copyrightInfo = byte_input.readStringWithUntil();
			return obj;
		}
		parseDefineBits(ver, length) {
			const obj = {};
			const byte_input = this.input;
			var startOffset = byte_input.position;
			obj.id = byte_input.readUint16();
			if (ver <= 2) {
				obj.data = byte_input.readBytes(length - 2);
			} else {
				var dataSize = byte_input.readUint32();
				var deblocking = null;
				if (ver >= 4) deblocking = byte_input.readUint16();
				var data = byte_input.readBytes(dataSize);
				var sub = byte_input.position - startOffset;
				var alphaData = byte_input.readBytes(length - sub);
				obj.data = data;
				obj.alphaData = alphaData;
				obj.deblocking = deblocking;
			}
			return obj;
		}
		parseDefineButtonCxform(length) {
			const byte_input = this.input;
			const startOffset = byte_input.position;
			const obj = {};
			obj.id = byte_input.readUint16();
			var colorTransforms = [];
			while (byte_input.position - startOffset < length) {
				colorTransforms.push(this.colorTransform(false));
				byte_input.byteAlign();
			}
			obj.colorTransforms = colorTransforms;
			return obj;
		}
		parseDefineMorphShape(ver) {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.startBounds = this.rect();
			obj.endBounds = this.rect();
			if (ver == 2) {
				obj.startEdgeBounds = this.rect();
				obj.endEdgeBounds = this.rect();
				var flags = byte_input.readUint8();
				obj.isScalingStrokes = flags & 1;
				obj.isNonScalingStrokes = (flags >>> 1) & 1;
			}
			byte_input.readUint32();
			obj.morphFillStyles = this.morphFillStyleArray(ver);
			obj.morphLineStyles = this.morphLineStyleArray(ver);
			obj.startEdges = this.morphShapeWithStyle(ver, false);
			obj.endEdges = this.morphShapeWithStyle(ver, true);
			return obj;
		}
		parseDefineFontAlignZones(length) {
			const byte_input = this.input;
			var tag = {};
			var startOffset = byte_input.position;
			tag.id = byte_input.readUint16();
			tag.thickness = byte_input.readUint8();
			var zones = [];
			while (byte_input.position < startOffset + length) {
				byte_input.readUint8();
				zones.push({
					left: byte_input.readInt16(),
					width: byte_input.readInt16(),
					bottom: byte_input.readInt16(),
					height: byte_input.readInt16(),
				});
				byte_input.readUint8();
			}
			tag.zones = zones;
			return tag;
		}
		parsePlaceObject(ver, length) {
			const byte_input = this.input;
			const obj = {};
			var startOffset = byte_input.position;
			obj.version = ver;
			if (ver === 1) {
				obj.isMove = false;
				obj.characterId = byte_input.readUint16();
				obj.depth = byte_input.readUint16();
				obj.matrix = this.matrix();
				byte_input.byteAlign();
				if (byte_input.position - startOffset < length)
					obj.colorTransform = this.colorTransform();
			} else {
				var flags = ver >= 3 ? byte_input.readUint16() : byte_input.readUint8();
				obj.depth = byte_input.readUint16();
				var isMove = flags & 1;
				var hasCharacter = (flags >>> 1) & 1;
				var hasMatrix = (flags >>> 2) & 1;
				var hasColorTransform = (flags >>> 3) & 1;
				var hasRatio = (flags >>> 4) & 1;
				var hasName = (flags >>> 5) & 1;
				var hasClipDepth = (flags >>> 6) & 1;
				var hasClipActions = (flags >>> 7) & 1;
				var hasFilters = (flags >>> 8) & 1;
				var hasBlendMode = (flags >>> 9) & 1;
				var hasBitmapCache = (flags >>> 10) & 1;
				var hasClassName = (flags >>> 11) & 1;
				var hasImage = (flags >>> 12) & 1;
				var hasVisible = (flags >>> 13) & 1;
				var hasBackgroundColor = (flags >>> 14) & 1;
				obj.hasImage = hasImage;
				if (hasClassName || (obj.hasImage && !hasCharacter))
					obj.className = byte_input.readStringWithUntil();
				obj.isMove = isMove;
				if (hasCharacter) obj.characterId = byte_input.readUint16();
				if (!obj.isMove && !hasCharacter)
					this.emitMessage("Invalid PlaceObject type", "error");
				if (hasMatrix) obj.matrix = this.matrix();
				if (hasColorTransform) obj.colorTransform = this.colorTransform(true);
				if (hasRatio) obj.ratio = byte_input.readUint16();
				if (hasName) obj.name = byte_input.readStringWithUntil();
				if (hasClipDepth) obj.clipDepth = byte_input.readUint16();
				if (hasFilters) obj.filters = this.getFilterList();
				if (hasBlendMode) obj.blendMode = byte_input.readUint8();
				if (hasBitmapCache) obj.bitmapCache = byte_input.readUint8();
				if (hasVisible) obj.visible = byte_input.readUint8();
				if (hasBackgroundColor) obj.backgroundColor = this.rgba();
				if (hasClipActions)
					obj.clipActions = this.parseClipActions(startOffset, length);
				if (ver === 4) {
					byte_input.byteAlign();
					obj.amfData = byte_input.readBytes(
						length - (byte_input.position - startOffset)
					);
				}
			}
			byte_input.byteAlign();
			return obj;
		}
		parseDoAction(length) {
			const byte_input = this.input;
			const obj = {};
			obj.action = byte_input.readBytes(length);
			return obj;
		}
		parseDoInitAction(length) {
			const byte_input = this.input;
			const obj = {};
			obj.spriteId = byte_input.readUint16();
			obj.action = byte_input.readBytes(length - 2);
			return obj;
		}
		parseDoABC(ver, length) {
			const byte_input = this.input;
			var startOffset = byte_input.position;
			const obj = {};
			obj.version = ver;
			if (ver == 2) {
				obj.flags = byte_input.readUint32();
				obj.lazyInitialize = obj.flags & 1;
				obj.name = byte_input.readStringWithUntil();
			}
			var offset = length - (byte_input.position - startOffset);
			obj.abc = byte_input.readBytes(offset);
			return obj;
		}
		parseProductInfo() {
			const byte_input = this.input;
			const obj = {};
			obj.productID = byte_input.readUint32();
			obj.edition = byte_input.readUint32();
			obj.majorVersion = byte_input.readUint8();
			obj.minorVersion = byte_input.readUint8();
			obj.buildBumber = byte_input.readUint64();
			obj.compilationDate = byte_input.readUint64();
			return obj;
		}
		parseDebugID(length) {
			const byte_input = this.input;
			const obj = {};
			obj.debugId = byte_input.readUint8();
			byte_input.position--;
			byte_input.position += length;
			return obj;
		}
		parseNameCharacter() {
			const byte_input = this.input;
			const obj = {};
			obj.id = byte_input.readUint16();
			obj.name = byte_input.readStringWithUntil();
			return obj;
		}
		parseFileAttributes() {
			const byte_input = this.input;
			const obj = {};
			var flags = byte_input.readUint32();
			obj.useDirectBlit = (flags >> 6) & 1;
			obj.useGPU = (flags >> 5) & 1;
			obj.hasMetadata = (flags >> 4) & 1;
			obj.isActionScript3 = (flags >> 3) & 1;
			obj.useNetworkSandbox = (flags >> 0) & 1;
			return obj;
		}
		parseSymbolClass() {
			const byte_input = this.input;
			const obj = {};
			var symbols = [];
			var count = byte_input.readUint16();
			while (count--) {
				symbols.push({
					tagId: byte_input.readUint16(),
					path: byte_input.readStringWithUntil(),
				});
			}
			obj.symbols = symbols;
			return obj;
		}
		parseFrameLabel(length) {
			const byte_input = this.input;
			var startOffset = byte_input.position;
			const obj = {};
			obj.label = byte_input.readStringWithUntil();
			var isAnchor = false;
			if (this._swfVersion >= 6 && byte_input.position - startOffset !== length)
				isAnchor = byte_input.readUint8() != 0;
			obj.isAnchor = isAnchor;
			return obj;
		}
		parseRemoveObject(ver) {
			const byte_input = this.input;
			const obj = {};
			if (ver == 1) obj.characterId = byte_input.readUint16();
			obj.depth = byte_input.readUint16();
			return obj;
		}
		parseExportAssets() {
			const obj = {};
			const byte_input = this.input;
			var count = byte_input.readUint16();
			var packages = [];
			while (count--) {
				var id = byte_input.readUint16();
				var name = byte_input.readStringWithUntil();
				packages.push([id, name]);
			}
			obj.packages = packages;
			return obj;
		}
		parseImportAssets(ver) {
			const byte_input = this.input;
			const obj = {};
			var url = byte_input.readStringWithUntil();
			if (ver == 2) {
				byte_input.readUint8();
				byte_input.readUint8();
			}
			var num_imports = byte_input.readUint16();
			var imports = [];
			while (num_imports--) {
				imports.push({
					id: byte_input.readUint16(),
					name: byte_input.readStringWithUntil(),
				});
			}
			obj.url = url;
			obj.imports = imports;
			return obj;
		}
		parseStartSound(ver) {
			const byte_input = this.input;
			const obj = {};
			if (ver == 2) obj.className = byte_input.readStringWithUntil();
			else obj.id = byte_input.readUint16();
			obj.info = this.parseSoundInfo();
			return obj;
		}
		parseSoundStreamHead(ver) {
			const obj = {};
			const byte_input = this.input;
			obj.version = ver;
			obj.playback = this.parseSoundFormat();
			obj.stream = this.parseSoundFormat();
			obj.samplePerBlock = byte_input.readUint16();
			if (obj.stream.compression === "MP3")
				obj.latencySeek = byte_input.readInt16();
			byte_input.byteAlign();
			return obj;
		}
		parseSoundStreamBlock(length) {
			const byte_input = this.input;
			const obj = {};
			obj.compressed = byte_input.readBytes(length);
			return obj;
		}
		parseVideoFrame(length) {
			const byte_input = this.input;
			var startOffset = byte_input.position;
			const obj = {};
			obj.streamId = byte_input.readUint16();
			obj.frameNum = byte_input.readUint16();
			var sub = byte_input.position - startOffset;
			var dataLength = length - sub;
			obj.data = byte_input.readBytes(dataLength);
			return obj;
		}
		parseCSMTextSettings() {
			const obj = {};
			const byte_input = this.input;
			obj.id = byte_input.readUint16();
			var flags = byte_input.readUint8();
			obj.useAdvancedRendering = flags & 0b01000000;
			switch ((flags >> 3) & 0b11) {
				case 0:
					obj.gridFit = "none";
					break;
				case 1:
					obj.gridFit = "pixel";
					break;
				case 2:
					obj.gridFit = "subPixel";
					break;
				default:
					this.emitMessage("Invalid text grid fitting", "error");
			}
			obj.thickness = byte_input.readFloat32();
			obj.sharpness = byte_input.readFloat32();
			byte_input.readUint8();
			return obj;
		}
	}
	class SwfMovie {
		constructor() {
			this._header = null;
			this.dataStream = null;
			this.url = null;
			this.loaderUrl = null;
			this.parameters = [];
			this.compressedLength = 0;
		}
		/// Construct a movie based on the contents of the SWF datastream.
		static fromData(swfData, url, loaderUrl) {
			var swfBuf = SwfInput.decompressSwf(swfData);
			var movie = new SwfMovie();
			movie._header = swfBuf.header;
			movie.dataStream = swfBuf.dataStream;
			movie.compressedLength = swfData.byteLength;
			return movie;
		}
		isActionScript3() {
			return this._header.fileAttributes.isActionScript3;
		}
		get header() {
			return this._header.header;
		}
		get uncompressedLength() {
			return this._header.uncompressedLength;
		}
		get stageSize() {
			return this._header.header.stageSize;
		}
		get frameRate() {
			return this._header.header.frameRate;
		}
		get numFrames() {
			return this._header.header.numFrames;
		}
		get backgroundColor() {
			return this._header.backgroundColor;
		}
		get version() {
			return this._header.header.version;
		}
		get width() {
			var stageSize = this.stageSize;
			return (stageSize.xMax - stageSize.xMin) / 20;
		}
		get height() {
			var stageSize = this.stageSize;
			return (stageSize.yMax - stageSize.yMin) / 20;
		}
	}
	class SwfSlice {
		constructor(movie) {
			this.movie = movie;
			this.start = 0;
			this.end = 0;
		}
		static from(movie) {
			var h = new SwfSlice(movie);
			h.start = 0;
			h.end = movie.dataStream.length;
			return h;
		}
		readFrom(from) {
			var b = this.movie.dataStream.from(this.start, this.end);
			b.position = from;
			var r = new SwfInput(b, this.movie.version);
			return r;
		}
		resizeToReader(reader, size) {
			let outer_offset = this.start + reader.input.position;
			let new_start = outer_offset;
			let new_end = outer_offset + size;
			var g = new SwfSlice(this.movie);
			g.start = new_start;
			g.end = new_end;
			return g;
		}
		get length() {
			return this.end - this.start;
		}
	}
	const decodeTags = function (reader, tagCallback) {
		while (reader.input.bytesAvailable > 0) {
			var { tagcode, length } = reader.parseTagCodeLength();
			var startO = reader.input.position;
			var c = tagCallback(reader, tagcode, length);
			var s = length - (reader.input.position - startO);
			reader.input.position += s;
			if (c == true) break;
		}
		return true;
	};
	class Glyph {
		constructor(shapeHandle) {
			this.shapeHandle = shapeHandle;
		}
	}
	class GlyphSource {
		constructor() {
			this.glyphs = [];
			this.codePointToGlyph = [];
		}
		addGlyphs(e) {
			var g = new Glyph(e);
			this.glyphs.push(g);
		}
		getByIndex(i) {
			return this.glyphs[i];
		}
	}
	class FlashFont {
		constructor() {
			this.glyphs = new GlyphSource();
			this.scale = 1024;
		}
		static fromSwfTag(renderer, tag) {
			var f = new FlashFont();
			f.scale = tag.version >= 3 ? 20480 : 1024;
			f.initGlyphs(renderer, tag.glyphs);
			return f;
		}
		initGlyphs(renderer, glyphs) {
			if (glyphs) {
				for (var i = 0; i < glyphs.length; i++) {
					var result = shapeUtils.convertWithCacheCodes(glyphs[i]);
					const sh = renderer.registerShape(result);
					this.glyphs.addGlyphs(sh);
				}
			}
		}
		setAlignZones(alignZones) {
			this.alignZones = alignZones;
		}
		getGlyph(index) {
			return this.glyphs.getByIndex(index);
		}
	}
	const getBlendMode = function(mode) {
		switch (mode) {
			case 0:
			case 1:
				return "normal";
			case 2:
				return "layer";
			case 3:
				return "multiply";
			case 4:
				return "screen";
			case 5:
				return "lighten";
			case 6:
				return "darken";
			case 7:
				return "difference";
			case 8:
				return "add";
			case 9:
				return "subtract";
			case 10:
				return "invert";
			case 11:
				return "alpha";
			case 12:
				return "erase";
			case 13:
				return "overlay";
			case 14:
				return "hardlight";
			default:
				return "error";
		}
	};
	const renderBase = function (context) {
		let blendMode = this.blendMode();
		let originalCommands = (blendMode != "normal") ? context.commands.copy() : null; 
		context.transformStack.stackPush(this.matrix(), this.colorTransform());
		if (originalCommands) {
			context.commands.clear();
		}
		this.renderSelf(context);
		if (originalCommands) {
			var subCommands = context.commands.copy();
			context.commands.replace(originalCommands);
			context.commands.blend(subCommands, blendMode);
		}
		context.transformStack.stackPop();
	}
	class DisplayObject {
		constructor() {
			this._matrix = [1, 0, 0, 1, 0, 0];
			this._colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];
			this._blendMode = "normal";
			this._filters = [];

			this._parent = null;
			this._placeFrame = 0;
			this._depth = 0;
			this._name = "";
			this._clipDepth = 0;
			this._nextAvm1Clip = null;
			this._soundTransform = null;
			this._masker = null;
			this._maskee = null;
			this._opaqueBackground = [0, 0, 0, 0];

			/// flags
			this.AVM1_REMOVED = false;
			this.VISIBLE = true;
			this.SCALE_ROTATION_CACHED = false;
			this.TRANSFORMED_BY_SCRIPT = false;
			this.PLACED_BY_SCRIPT = false;
			this.INSTANTIATED_BY_TIMELINE = false;
			this.IS_ROOT = false;
			this.LOCK_ROOT = false;
			this.CACHE_AS_BITMAP = false;
			this.HAS_SCROLL_RECT = false;
			this.HAS_EXPLICIT_NAME = false;
			this.SKIP_NEXT_ENTER_FRAME = false;
			this.CACHE_INVALIDATED = false;

			this.displayType = "Base";
			this.coll = [0, 0, 0, 1];
			this._debug_colorDisplayType = [0, 0, 0, 1];
		}
		matrix() {
			return this._matrix;
		}
		colorTransform() {
			return this._colorTransform;
		}
		applyColorTransform(colorTransform) {
			this._colorTransform[0] = colorTransform[0];
			this._colorTransform[1] = colorTransform[1];
			this._colorTransform[2] = colorTransform[2];
			this._colorTransform[3] = colorTransform[3];
			this._colorTransform[4] = colorTransform[4];
			this._colorTransform[5] = colorTransform[5];
			this._colorTransform[6] = colorTransform[6];
			this._colorTransform[7] = colorTransform[7];
		}
		applyMatrix(matrix) {
			this._matrix[0] = matrix[0];
			this._matrix[1] = matrix[1];
			this._matrix[2] = matrix[2];
			this._matrix[3] = matrix[3];
			this._matrix[4] = matrix[4];
			this._matrix[5] = matrix[5];
		}
		blendMode() {
			return this._blendMode;
		}
		setBlendMode(mode) {
			this._blendMode = getBlendMode(mode);
		}
		depth() {
			return this._depth;
		}
		setDepth(value) {
			this._depth = value;
		}
		clipDepth() {
			return this._clipDepth;
		}
		setClipDepth(value) {
			this._clipDepth = value;
		}
		placeFrame() {
			return this._placeFrame;
		}
		setPlaceFrame(frame) {
			this._placeFrame = frame;
		}
		getParent() {
			return this._parent;
		}
		setParent(context, parent) {
			this._parent = parent;
		}
		name() {
			return this._name;
		}
		setName(name) {
			this._name = name;
		}
		nextAvm1Clip() {
			return this._nextAvm1Clip;
		}
		setNextAvm1Clip(value) {
			this._nextAvm1Clip = value;
		}
		visible() {
			return this.VISIBLE;
		}
		setVisible(value) {
			this.VISIBLE = value;
		}
		isRoot() {
			return this.IS_ROOT;
		}
		setIsRoot(bool) {
			this.IS_ROOT = bool;
		}
		avm1Removed() {
			return this.AVM1_REMOVED;
		}
		setAvm1Removed(value) {
			this.AVM1_REMOVED = value;
		}
		transformedByScript() {
			return this.TRANSFORMED_BY_SCRIPT;
		}
		setTransformedByScript(value) {
			this.TRANSFORMED_BY_SCRIPT = value;
		}
		instantiatedByTimeline() {
			return this.INSTANTIATED_BY_TIMELINE;
		}
		setInstantiatedByTimeline(value) {
			this.INSTANTIATED_BY_TIMELINE = value;
		}
		shouldSkipNextEnterFrame() {
			return this.SKIP_NEXT_ENTER_FRAME;
		}
		setSkipNextEnterFrame(b) {
			this.SKIP_NEXT_ENTER_FRAME = b;
		}
		getId() {
			return 0;
		}
		setDefaultInstanceName(context) {
			if (!this.name().length) {
				var r = context.addInstanceCounter();
				this.setName("instance" + r);
			}
		}
		applyPlaceObject(context, placeObject) {
			if (!this.transformedByScript()) {
				if ("matrix" in placeObject) {
					this.applyMatrix(placeObject.matrix);
				}
				if ("colorTransform" in placeObject) {
					this.applyColorTransform(placeObject.colorTransform);
				}
				if ("visible" in placeObject) {
					this.setVisible(!!placeObject.visible);
				}
				if ("blendMode" in placeObject) {
					this.setBlendMode(placeObject.blendMode);
				}
				if (this.displayType == "MorphShape" || this.displayType == "Video") {
					if ("ratio" in placeObject) {
						if (this.displayType == "Video") {
							this.seek(context, placeObject.ratio);
						} else {
							this.setRatio(placeObject.ratio);
						}
					}
				}
				if ("backgroundColor" in placeObject) {
				}
			}
		}
		replaceWith(context, characterId) { }
		postInstantiation(context, initObject, instantiatedBy, runFrame) {
			if (runFrame) {
				this.runFrameAvm1();
			}
		}
		selfBounds() {
			return { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };
		}
		render(context) {
			renderBase.call(this, context);
		}
		debugRenderBounds(matrix, colorTransform, tags) {
			var rMatrix = multiplicationMatrix(matrix, this.matrix());
			var rColorTransform = multiplicationColor(colorTransform, this.colorTransform());
			var bounds = this.selfBounds();
			var matrixBounds = boundsMatrix(bounds, rMatrix);
			tags.push([4, this.displayType, this._debug_colorDisplayType[0], this._debug_colorDisplayType[1], this._debug_colorDisplayType[2]]);
			tags.push([3, [+rColorTransform[0].toFixed(3), +rColorTransform[1].toFixed(3), +rColorTransform[2].toFixed(3), +rColorTransform[3].toFixed(3), +rColorTransform[4].toFixed(3), +rColorTransform[5].toFixed(3), +rColorTransform[6].toFixed(3), +rColorTransform[7].toFixed(3)]]);
			var g1 = generateMatrix([bounds.xMin, bounds.yMin], rMatrix);
			var g2 = generateMatrix([bounds.xMax, bounds.yMin], rMatrix);
			var g3 = generateMatrix([bounds.xMax, bounds.yMax], rMatrix);
			var g4 = generateMatrix([bounds.xMin, bounds.yMax], rMatrix);
			tags.push([0, g1[0] | 0, g1[1] | 0, g2[0] | 0, g2[1] | 0, g3[0] | 0, g3[1] | 0, g4[0] | 0, g4[1] | 0]);
			tags.push([1, matrixBounds.xMin | 0, matrixBounds.yMin | 0, matrixBounds.xMax | 0, matrixBounds.yMax | 0]);
			tags.push([2, matrixBounds.xMin | 0, matrixBounds.yMin | 0]);
		}
		renderSelf() { }
		enterFrame() { }
		runFrameAvm1() { }
		isInteractive() {
			return false;
		}
		isContainer() {
			return false;
		}
		avm1Unload(context) {
			if (this.isContainer()) {
				var children = this.iterRenderList();
				for (let i = 0; i < children.length; i++) {
					const child = children[i];
					child.avm1Unload(context);
				}
			}
			this.setAvm1Removed(true);
		}
		setState() { }
		applyDisplayObject(displayObject) {
			displayObject.applyMatrix(this._matrix);
			displayObject.applyColorTransform(this._colorTransform);
			displayObject._blendMode = "normal";
			displayObject._filters = [];

			displayObject._parent = this._parent;
			displayObject._placeFrame = this._placeFrame;
			displayObject._depth = this._depth;
			displayObject._name = this._name;
			displayObject._clipDepth = this._clipDepth;
			displayObject._nextAvm1Clip = this._nextAvm1Clip;
			displayObject._soundTransform = null;
			displayObject._masker = this._masker;
			displayObject._maskee = this._maskee;
			displayObject._opaqueBackground = [0, 0, 0, 0];

			/// flags
			displayObject.AVM1_REMOVED = this.AVM1_REMOVED;
			displayObject.VISIBLE = this.VISIBLE;
			displayObject.SCALE_ROTATION_CACHED = this.SCALE_ROTATION_CACHED;
			displayObject.TRANSFORMED_BY_SCRIPT = this.TRANSFORMED_BY_SCRIPT;
			displayObject.PLACED_BY_SCRIPT = this.PLACED_BY_SCRIPT;
			displayObject.INSTANTIATED_BY_TIMELINE = this.INSTANTIATED_BY_TIMELINE;
			displayObject.IS_ROOT = this.IS_ROOT;
			displayObject.LOCK_ROOT = this.LOCK_ROOT;
			displayObject.CACHE_AS_BITMAP = this.CACHE_AS_BITMAP;
			displayObject.HAS_SCROLL_RECT = this.HAS_SCROLL_RECT;
			displayObject.HAS_EXPLICIT_NAME = this.HAS_EXPLICIT_NAME;
			displayObject.SKIP_NEXT_ENTER_FRAME = this.SKIP_NEXT_ENTER_FRAME;
			displayObject.CACHE_INVALIDATED = this.CACHE_INVALIDATED;
		}
	}
	class InteractiveObject extends DisplayObject {
		constructor() {
			super();
			this._mouseEnabled = true;
			this.displayType = "InteractiveObject";
		}
		isInteractive() {
			return true;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject._mouseEnabled = this._mouseEnabled;
		}
	}
	class ChildContainer {
		constructor() {
			this.renderList = [];
			this.depthList = [];
		}
		numChildren() {
			return this.renderList.length;
		}
		replaceId(id, child) {
			this.renderList[id] = child;
		}
		insertId(id, child) {
			if (this.renderList.length) {
				if (id >= this.renderList.length) {
					this.renderList.push(child);
				} else {
					this.renderList.splice(id, 0, child);
				}
			} else {
				this.renderList.push(child);
			}
		}
		pushId(child) {
			this.renderList.push(child);
		}
		removeId(id) {
			if (this.renderList.length) {
				if (id >= this.renderList.length) {
					this.renderList.pop();
				} else {
					this.renderList.splice(id, 1);
				}
			}
		}
		removeChildFromDepthList(child) {
			let depth = child.depth();
			delete this.depthList[depth];
		}
		removeChildFromRenderList(child, context) {
			let rs = this.renderList.indexOf(child);
			if (rs >= 0) {
				this.removeId(rs);
			} else {
				console.log(child);
			}
		}
		getDepth(depth) {
			return this.depthList[depth];
		}
		insertChildIntoDepthList(depth, child) {
			let r = this.depthList[depth];
			this.depthList[depth] = child;
			return r;
		}
		replaceAtDepth(depth, child) {
			let prevChild = this.insertChildIntoDepthList(depth, child);
			if (prevChild) {
				console.log(prevChild);
			}
			let aboveChild = null;
			for (let i = 0; i < this.depthList.length; i++) {
				const c = this.depthList[i];
				if (c && i !== depth) {
					if (i > depth) {
						aboveChild = c;
						break;
					}
				}
			}
			if (aboveChild) {
				let rs = this.renderList.indexOf(aboveChild);
				if (rs >= 0) {
					this.insertId(rs, child);
				} else {
					this.pushId(child);
				}
			} else {
				this.pushId(child);
			}
		}
	}
	class DisplayObjectContainer extends InteractiveObject {
		constructor() {
			super();
			this.displayType = "Container";
		}
		rawContainer() {}
		isContainer() {
			return true;
		}
		replaceAtDepth(context, depth, child) {
			let rawContainer = this.rawContainer();
			rawContainer.replaceAtDepth(depth, child);
		}
		childByDepth(depth) {
			return this.rawContainer().getDepth(depth);
		}
		removeChild(context, child) {
			this.removeChildDirectly(context, child);
		}
		removeChildDirectly(context, child) {
			let rawContainer = this.rawContainer();
			rawContainer.removeChildFromDepthList(child);
			rawContainer.removeChildFromRenderList(child, context);
			child.avm1Unload(context);
		}
		iterRenderList() {
			return this.rawContainer().renderList.slice(0);
		}
		selfBounds() {
			let children = this.iterRenderList();
			let xMax = Number.MIN_VALUE;
			let yMax = Number.MIN_VALUE;
			let xMin = Number.MAX_VALUE;
			let yMin = Number.MAX_VALUE;
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				let matrix2 = child.matrix();
				let b = boundsMatrix(child.selfBounds(), matrix2);
				xMin = Math.min(xMin, b.xMin);
				xMax = Math.max(xMax, b.xMax);
				yMin = Math.min(yMin, b.yMin);
				yMax = Math.max(yMax, b.yMax);
			}
			if (!children.length) (xMin = 0), (yMin = 0), (xMax = 0), (yMax = 0);
			return { xMin, xMax, yMin, yMax };
		}
		renderSelf(context) {
			this.renderChildren(context);
		}
		renderChildren(context) {
			const children = this.iterRenderList();
			let clipDepth = 0;
			let clipDepthStack = [];
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				let depth = child.depth();
				while (clipDepth > 0 && depth > clipDepth) {
					let [prevClipDepth, clipChild] = clipDepthStack.pop();
					clipDepth = prevClipDepth;
					context.commands.deactivateMask();
					clipChild.render(context);
					context.commands.popMask();
				}
				if (child.clipDepth() > 0) {
					clipDepthStack.push([clipDepth, child]);
					clipDepth = child.clipDepth();
					context.commands.pushMask();
					child.render(context);
					context.commands.activateMask();
				} else if (child.visible() || context.commands.drawingMask()) {
					child.render(context);
				}
			}
			for (let j = clipDepthStack.length - 1; j >= 0; j--) {
				context.commands.deactivateMask();
				clipDepthStack[j][1].render(context);
				context.commands.popMask();
			}
		}
		debugRenderBounds(matrix, colorTransform, tags) {
			var rMatrix = multiplicationMatrix(matrix, this.matrix());
			var rColorTransform = multiplicationColor(colorTransform, this.colorTransform());
			const children = this.iterRenderList();
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				child.debugRenderBounds(rMatrix, rColorTransform, tags);
			}
			if (!this.isRoot()) {
				var bounds = this.selfBounds();
				var matrixBounds = boundsMatrix(bounds, rMatrix);
				tags.push([4, this.displayType, this._debug_colorDisplayType[0], this._debug_colorDisplayType[1], this._debug_colorDisplayType[2],]);
				tags.push([3, [+rColorTransform[0].toFixed(3), +rColorTransform[1].toFixed(3), +rColorTransform[2].toFixed(3), +rColorTransform[3].toFixed(3), +rColorTransform[4].toFixed(3), +rColorTransform[5].toFixed(3), +rColorTransform[6].toFixed(3), +rColorTransform[7].toFixed(3)]]);
				tags.push([1, matrixBounds.xMin | 0, matrixBounds.yMin | 0, matrixBounds.xMax | 0, matrixBounds.yMax | 0]);
				tags.push([2, matrixBounds.xMin | 0, (matrixBounds.yMin | 0) - 20]);
			}
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
		}
	}
	class Graphic extends DisplayObject {
		constructor(data) {
			super();
			this.staticData = null;
			this.displayType = "Shape";
			this._debug_colorDisplayType = [0, 0, 255, 1];
			if (data) data.applyDisplayObject(this);
		}
		static fromSwfTag(context, swfShape, movie) {
			const data = new Graphic();
			const staticData = new GraphicStatic();
			staticData.id = swfShape.id;
			staticData.movie = movie;
			staticData.shape = swfShape;
			staticData.bounds = swfShape.bounds;
			data.staticData = staticData;
			return data;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject.staticData = this.staticData;
		}
		getId() {
			return this.staticData.id;
		}
		replaceWith(context, id) {
			let library = context.library.libraryForMovie(this.movie());
			let new_graphic = library.characterById(id);
			this.staticData = new_graphic.staticData;
		}
		renderSelf(context) {
			let staticData = this.staticData;
			let renderHandle = staticData.getRenderHandle(context, context.library);
			context.commands.renderShape(renderHandle, context.transformStack.getMatrix(), context.transformStack.getColorTransform());
		}
		selfBounds() {
			return this.staticData.bounds;
		}
		movie() {
			return this.staticData.movie;
		}
		instantiate() {
			return new Graphic(this);
		}
	}
	class GraphicStatic {
		constructor() {
			this.id = 0;
			this.movie = null;
			this.shape = null;
			this.renderHandle = null;
			this.bounds = null;
			this.movie = null;
		}
		getRenderHandle(context, library) {
			if (!this.renderHandle) this.renderHandle = context.renderer.registerShape(shapeUtils.convert(this.shape, "shape"), library.libraryForMovie(this.movie));
			return this.renderHandle;
		}
	}
	class MorphShape extends DisplayObject {
		constructor(data) {
			super();
			this._ratio = 0;
			this.staticData = null;
			this.displayType = "MorphShape";
			this._debug_colorDisplayType = [0, 255, 255, 1];
			if (data) data.applyDisplayObject(this);
		}
		static fromSwfTag(tag, movie) {
			const morph_shape = new MorphShape();
			const staticData = MorphShapeStatic.fromSwfTag(tag, movie);
			morph_shape.staticData = staticData;
			return morph_shape;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject._ratio = this._ratio;
			displayObject.staticData = this.staticData;
		}
		setRatio(ratio) {
			this._ratio = ratio;
		}
		getId() {
			return this.staticData.id;
		}
		movie() {
			return this.staticData.movie;
		}
		selfBounds() {
			return this.staticData.getFrame(this._ratio).bounds;
		}
		renderSelf(context) {
			const ratio = this._ratio;
			const static_data = this.staticData;
			const shape_handle = static_data.getShape(context, context.library, ratio);
			context.commands.renderShape(shape_handle, context.transformStack.getMatrix(), context.transformStack.getColorTransform());
		}
		replaceWith(context, id) {
			var library = context.library.libraryForMovie(this.movie());
			var new_graphic = library.characterById(id);
			this.staticData = new_graphic.staticData;
		}
		instantiate() {
			return new MorphShape(this);
		}
	}
	class MorphShapeStatic {
		constructor() {
			this.data = null;
			this.id = 0;
			this.morphCaches = [];
			this.movie = null;
		}
		static fromSwfTag(tag, movie) {
			const g = new MorphShapeStatic();
			g.id = tag.id;
			g.data = tag;
			g.movie = movie;
			return g;
		}
		getFrame(ratio) {
			if (!this.morphCaches[ratio]) {
				this.morphCaches[ratio] = this.buildMorphFrame(ratio / 65536);
			}
			return this.morphCaches[ratio];
		}
		getShape(context, library, ratio) {
			var frame = this.getFrame(ratio);
			if (!frame.shapeHandle) {
				var h = library.libraryForMovie(this.movie);
				var shape = shapeUtils.convert(frame.shapes, "morphshape");
				var handle = context.renderer.registerShape(shape, h);
				frame.shapeHandle = handle;
			}
			return frame.shapeHandle;
		}
		lerpTwips(start, end, per) {
			var startPer = 1 - per;
			return start * startPer + end * per;
		}
		lerpColor(startColor, endColor, per) {
			var startPer = 1 - per;
			return [Math.floor(startColor[0] * startPer + endColor[0] * per), Math.floor(startColor[1] * startPer + endColor[1] * per), Math.floor(startColor[2] * startPer + endColor[2] * per), startColor[3] * startPer + endColor[3] * per];
		}
		lerpMatrix(startMatrix, endMatrix, per) {
			var startPer = 1 - per;
			return [startMatrix[0] * startPer + endMatrix[0] * per, startMatrix[1] * startPer + endMatrix[1] * per, startMatrix[2] * startPer + endMatrix[2] * per, startMatrix[3] * startPer + endMatrix[3] * per, startMatrix[4] * startPer + endMatrix[4] * per, startMatrix[5] * startPer + endMatrix[5] * per];
		}
		lerpFill(fillStyle, per) {
			var fillStyleType = fillStyle.type;
			if (fillStyleType === 0x00) {
				return {
					color: this.lerpColor(fillStyle.startColor, fillStyle.endColor, per),
					type: fillStyleType,
				};
			} else {
				if (fillStyleType == 0x40 || fillStyleType == 0x41 || fillStyleType == 0x42 || fillStyleType == 0x43) {
					return {
						bitmapId: fillStyle.bitmapId,
						bitmapMatrix: this.lerpMatrix(fillStyle.bitmapStartMatrix, fillStyle.bitmapEndMatrix, per),
						isSmoothed: fillStyle.isSmoothed,
						isRepeating: fillStyle.isRepeating,
						type: fillStyleType,
					};
				} else {
					var gradient = fillStyle.gradient;
					if (!gradient) gradient = fillStyle.linearGradient;
					if (!gradient) gradient = fillStyle.radialGradient;
					var focalPoint = 0;
					if (fillStyleType == 19)
						focalPoint = this.lerpTwips(fillStyle.startFocalPoint, fillStyle.endFocalPoint, per);
					var gRecords = [];
					var GradientRecords = gradient.gradientRecords;
					for (var gIdx = 0; gIdx < GradientRecords.length; gIdx++) {
						var gRecord = GradientRecords[gIdx];
						gRecords[gIdx] = {
							color: this.lerpColor(gRecord.startColor, gRecord.endColor, per),
							ratio: this.lerpTwips(gRecord.startRatio, gRecord.endRatio, per),
						};
					}
					return {
						gradient: {
							matrix: this.lerpMatrix(gradient.startMatrix, gradient.endMatrix, per),
							gradientRecords: gRecords,
							spreadMode: gradient.spreadMode,
							interpolationMode: gradient.interpolationMode,
						},
						focalPoint,
						type: fillStyleType,
					};
				}
			}
		}
		lerpLine(lineStyle, per) {
			var width = this.lerpTwips(lineStyle.startWidth, lineStyle.endWidth, per);
			if (lineStyle.fillType) {
				return {
					width: width,
					fillType: this.lerpFill(lineStyle.fillType, per),
				};
			} else {
				return {
					width: width,
					color: this.lerpColor(lineStyle.startColor, lineStyle.endColor, per),
				};
			}
		}
		buildEdges(per) {
			var startPer = 1 - per;
			var startPosition = { x: 0, y: 0 };
			var endPosition = { x: 0, y: 0 };
			var StartRecords = JSON.parse(JSON.stringify(this.data.startEdges));
			var EndRecords = JSON.parse(JSON.stringify(this.data.endEdges));
			var StartRecordLength = StartRecords.length;
			var EndRecordLength = EndRecords.length;
			var length = Math.max(StartRecordLength, EndRecordLength);
			for (var i = 0; i < length; i++) {
				var addRecode = {};
				var StartRecord = StartRecords[i];
				var EndRecord = EndRecords[i];
				if (!StartRecord || !EndRecord) continue;
				if (!StartRecord.isChange && !EndRecord.isChange) {
					if (StartRecord.isCurved) {
						startPosition.x += StartRecord.controlDeltaX + StartRecord.anchorDeltaX;
						startPosition.y += StartRecord.controlDeltaY + StartRecord.anchorDeltaY;
					} else {
						startPosition.x += StartRecord.deltaX;
						startPosition.y += StartRecord.deltaY;
					}
					if (EndRecord.isCurved) {
						endPosition.x += EndRecord.controlDeltaX + EndRecord.anchorDeltaX;
						endPosition.y += EndRecord.controlDeltaY + EndRecord.anchorDeltaY;
					} else {
						endPosition.x += EndRecord.deltaX;
						endPosition.y += EndRecord.deltaY;
					}
					continue;
				}
				if (StartRecord.isChange && !EndRecord.isChange) {
					addRecode = {
						fillStyle0: StartRecord.fillStyle0,
						fillStyle1: StartRecord.fillStyle1,
						lineStyle: StartRecord.lineStyle,
						stateFillStyle0: StartRecord.stateFillStyle0,
						stateFillStyle1: StartRecord.stateFillStyle1,
						stateLineStyle: StartRecord.stateLineStyle,
						stateMoveTo: StartRecord.stateMoveTo,
						stateNewStyles: StartRecord.stateNewStyles,
						isChange: true,
					};
					if (StartRecord.stateMoveTo) {
						addRecode.moveX = endPosition.x;
						addRecode.moveY = endPosition.y;
						startPosition.x = StartRecord.moveX;
						startPosition.y = StartRecord.moveY;
					}
					EndRecords.splice(i, 0, addRecode);
				} else if (!StartRecord.isChange && EndRecord.isChange) {
					addRecode = {
						fillStyle0: EndRecord.fillStyle0,
						fillStyle1: EndRecord.fillStyle1,
						lineStyle: EndRecord.lineStyle,
						stateFillStyle0: EndRecord.stateFillStyle0,
						stateFillStyle1: EndRecord.stateFillStyle1,
						stateLineStyle: EndRecord.stateLineStyle,
						stateMoveTo: EndRecord.stateMoveTo,
						stateNewStyles: EndRecord.stateNewStyles,
						isChange: true,
					};
					if (EndRecord.stateMoveTo) {
						addRecode.moveX = startPosition.x;
						addRecode.moveY = startPosition.y;
						endPosition.x = EndRecord.moveX;
						endPosition.y = EndRecord.moveY;
					}
					StartRecords.splice(i, 0, addRecode);
				} else {
					if (StartRecord.stateMoveTo) {
						startPosition.x = StartRecord.moveX;
						startPosition.y = StartRecord.moveY;
					}
					if (EndRecord.stateMoveTo) {
						endPosition.x = EndRecord.moveX;
						endPosition.y = EndRecord.moveY;
					}
				}
			}
			var FillType = 0;
			var FillStyle = 0;
			length = StartRecords.length;
			for (var i = 0; i < length; i++) {
				var record = StartRecords[i];
				if (!record.isChange) continue;
				if (record.stateFillStyle0) FillStyle = record.fillStyle0;
				if (FillStyle) {
					record.stateFillStyle0 = 1;
					record.stateFillStyle1 = 1;
					if (FillType) {
						record.fillStyle0 = 0;
						record.fillStyle1 = FillStyle;
					} else {
						record.fillStyle0 = FillStyle;
						record.fillStyle1 = 0;
					}
				} else {
					record.stateFillStyle1 = 1;
					record.fillStyle1 = 0;
				}
				FillType = FillType ? 0 : 1;
			}
			var newShapeRecords = [];
			var len = StartRecords.length;
			for (var i = 0; i < len; i++) {
				var StartRecord = StartRecords[i];
				if (!StartRecord) continue;
				var EndRecord = EndRecords[i];
				if (!EndRecord) continue;
				var newRecord = {};
				if (StartRecord.isChange) {
					var MoveX = 0;
					var MoveY = 0;
					if (StartRecord.stateMoveTo === 1) {
						MoveX = StartRecord.moveX * startPer + EndRecord.moveX * per;
						MoveY = StartRecord.moveY * startPer + EndRecord.moveY * per;
					}
					newRecord = {
						fillStyle0: StartRecord.fillStyle0,
						fillStyle1: StartRecord.fillStyle1,
						lineStyle: StartRecord.lineStyle,
						moveX: MoveX,
						moveY: MoveY,
						stateFillStyle0: StartRecord.stateFillStyle0,
						stateFillStyle1: StartRecord.stateFillStyle1,
						stateLineStyle: StartRecord.stateLineStyle,
						stateMoveTo: StartRecord.stateMoveTo,
						stateNewStyles: StartRecord.stateNewStyles,
						isChange: true,
					};
				} else {
					newRecord = this.lerpEdges(StartRecord, EndRecord, per);
				}
				newShapeRecords[i] = newRecord;
			}
			return newShapeRecords;
		}
		lerpEdges(start, end, per) {
			var startIsCurved = start.isCurved;
			var endIsCurved = end.isCurved;
			if (!startIsCurved && !endIsCurved) {
				return {
					deltaX: this.lerpTwips(start.deltaX, end.deltaX, per),
					deltaY: this.lerpTwips(start.deltaY, end.deltaY, per),
					isCurved: false,
					isChange: false,
				};
			} else if (startIsCurved && endIsCurved) {
				return {
					controlDeltaX: this.lerpTwips(start.controlDeltaX, end.controlDeltaX, per),
					controlDeltaY: this.lerpTwips(start.controlDeltaY, end.controlDeltaY, per),
					anchorDeltaX: this.lerpTwips(start.anchorDeltaX, end.anchorDeltaX, per),
					anchorDeltaY: this.lerpTwips(start.anchorDeltaY, end.anchorDeltaY, per),
					isCurved: true,
					isChange: false,
				};
			} else if (!startIsCurved && endIsCurved) {
				var deltaX = start.deltaX / 2;
				var deltaY = start.deltaY / 2;
				return {
					controlDeltaX: this.lerpTwips(deltaX, end.controlDeltaX, per),
					controlDeltaY: this.lerpTwips(deltaY, end.controlDeltaY, per),
					anchorDeltaX: this.lerpTwips(deltaX, end.anchorDeltaX, per),
					anchorDeltaY: this.lerpTwips(deltaY, end.anchorDeltaY, per),
					isCurved: true,
					isChange: false,
				};
			} else if (startIsCurved && !endIsCurved) {
				var deltaX = end.deltaX / 2;
				var deltaY = end.deltaY / 2;
				return {
					controlDeltaX: this.lerpTwips(start.controlDeltaX, deltaX, per),
					controlDeltaY: this.lerpTwips(start.controlDeltaY, deltaY, per),
					anchorDeltaX: this.lerpTwips(start.anchorDeltaX, deltaX, per),
					anchorDeltaY: this.lerpTwips(start.anchorDeltaY, deltaY, per),
					isCurved: true,
					isChange: false,
				};
			}
		}
		buildMorphFrame(per) {
			var shapes = {
				lineStyles: [],
				fillStyles: [],
				shapeRecords: [],
			};
			var lineStyles = JSON.parse(JSON.stringify(this.data.morphLineStyles));
			var fillStyles = JSON.parse(JSON.stringify(this.data.morphFillStyles));
			for (var i = 0; i < lineStyles.length; i++) {
				shapes.lineStyles[i] = this.lerpLine(lineStyles[i], per);
			}
			for (var i = 0; i < fillStyles.length; i++) {
				shapes.fillStyles[i] = this.lerpFill(fillStyles[i], per);
			}
			shapes.shapeRecords = this.buildEdges(per);
			var bounds = shapeUtils.calculateShapeBounds(shapes.shapeRecords);
			return {
				shapeHandle: null,
				bounds,
				shapes,
			};
		}
	}
	class StaticText extends DisplayObject {
		constructor(data) {
			super();
			this.displayType = "StaticText";
			this._debug_colorDisplayType = [255, 0, 255, 1];
			if (data) data.applyDisplayObject(this);
		}
		static fromSwfTag(context, movie, tag) {
			const text = new StaticText();
			const staticData = new TextStatic();
			staticData.id = tag.id;
			staticData.bounds = tag.bounds;
			staticData.matrix = tag.matrix;
			staticData.textBlocks = tag.records;
			staticData.movie = movie;
			text.staticData = staticData;
			return text;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject.staticData = this.staticData;
		}
		runFrameAvm1() { }
		selfBounds() {
			return this.staticData.bounds;
		}
		renderSelf(context) {
			var library = context.library.libraryForMovie(this.movie());
			var offsetX = 0;
			var offsetY = 0;
			var color = [0, 0, 0, 0];
			var textHeight = 0;
			var fontData;
			context.transformStack.stackPush(this.staticData.matrix, [1, 1, 1, 1, 0, 0, 0, 0]);
			for (var i = 0; i < this.staticData.textBlocks.length; i++) {
				var record = this.staticData.textBlocks[i];
				if ("fontId" in record) fontData = library.characterById(record.fontId);
				if ("XOffset" in record) offsetX = record.XOffset;
				if ("YOffset" in record) offsetY = record.YOffset;
				if ("textColor" in record) color = record.textColor;
				if ("textHeight" in record) textHeight = record.textHeight;
				var entries = record.glyphEntries;
				var _scale = textHeight / fontData.scale;
				for (var idx = 0; idx < entries.length; idx++) {
					var entry = entries[idx];
					var glyph = fontData.getGlyph(entry.index);
					if (glyph) {
						var shapeRender = glyph.shapeHandle;
						if (shapeRender) {
							var _matrix = [_scale, 0, 0, _scale, offsetX, offsetY];
							context.transformStack.stackPush(_matrix, [color[0] / 255, color[1] / 255, color[2] / 255, color[3], 0, 0, 0, 0]);
							var m2 = context.transformStack.getMatrix();
							var colorTransform = context.transformStack.getColorTransform();
							context.commands.renderShape(shapeRender, m2, colorTransform);
							context.transformStack.stackPop();
							offsetX += entry.advance;
						}
					}
				}
			}
			context.transformStack.stackPop();
		}
		replaceWith(context, id) {
			var library = context.library.libraryForMovie(this.movie());
			var new_graphic = library.characterById(id);
			this.staticData = new_graphic.staticData;
		}
		getId() {
			return this.staticData.id;
		}
		instantiate() {
			return new StaticText(this);
		}
		movie() {
			return this.staticData.movie;
		}
	}
	class TextStatic {
		constructor() {
			this.id = 0;
			this.settings = null;
			this.movie = null;
			this.bounds = null;
			this.matrix = [1, 0, 0, 1, 0, 0];
			this.textBlocks = [];
		}
		setRenderSettings(settings) {}
	}
	class TextField extends InteractiveObject {
		constructor(data) {
			super();
			this.staticData = null;
			this.displayType = "TextField";
			this._debug_colorDisplayType = [255, 255, 0, 1];
			if (data) data.applyDisplayObject(this);
		}
		static fromSwfTag(context, movie, edit_text) {
			const data = new TextField();
			const staticData = new EditTextStatic();
			staticData.id = edit_text.id;
			staticData.swf = movie;
			staticData.bounds = edit_text.bounds;
			data.staticData = staticData;
			return data;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject.staticData = this.staticData;
		}
		selfBounds() {
			return this.staticData.bounds;
		}
		getId() {
			return this.staticData.id;
		}
		instantiate() {
			return new TextField(this);
		}
		movie() {
			return this.staticData.swf;
		}
	}
	class EditTextStatic {
		constructor() {
			this.swf = null;
			this.id = null;
			this.bounds = null;
		}
	}
	class BitmapGraphic extends DisplayObject {
		constructor(data) {
			super();
			this._bitmapH = null;
			this._id = 0;
			this._size = [0, 0];
			this._debug_colorDisplayType = [255, 155, 0, 1];
			this.displayType = "Bitmap";
			if (data) data.applyDisplayObject(this);
		}
		static createNew(context, id, bitmap) {
			let h = new BitmapGraphic();
			h._bitmapH = bitmap;
			h._id = id;
			h._size = [bitmap.width, bitmap.height];
			return h;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject._bitmapH = this._bitmapH;
			displayObject._id = this._id;
			displayObject._size = this._size.slice(0);
		}
		selfBounds() {
			return {
				xMin: 0,
				yMin: 0,
				xMax: this._size[0] * 20,
				yMax: this._size[1] * 20,
			};
		}
		bitmapH() {
			return this._bitmapH;
		}
		renderSelf(context) {
			context.transformStack.stackPush([20, 0, 0, 20, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0]);
			context.commands.renderBitmap(this.bitmapH(), context.transformStack.getMatrix(), context.transformStack.getColorTransform(), false);
			context.transformStack.stackPop();
		}
		getId() {
			return this._id;
		}
		instantiate() {
			return new BitmapGraphic(this);
		}
	}
	class DisplayVideoStream extends DisplayObject {
		constructor(data) {
			super();
			this.__size = [0, 0];
			this.__movie = null;
			this._ratio = 0;
			this.stream = {
				isInstantiated: false,
				result: 0
			};
			this.keyframes = [];
			this.source = null;
			this.isSmoothed = false;
			this.decoded_frame = [0, null];
			this._debug_colorDisplayType = [255, 100, 100, 1];
			this.displayType = "Video";
			if (data) data.applyDisplayObject(this);
		}
		static fromSwfTag(movie, streamdef) {
			const h = new DisplayVideoStream();
			h.source = {
				type: "swf",
				streamdef,
				frames: []
			};
			h.__size = [streamdef.width, streamdef.height];
			h.__movie = movie;
			return new DisplayVideoStream(h);
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject.__size = this.__size.slice(0);
			displayObject.__movie = this.__movie;
			displayObject._ratio = this._ratio;
			displayObject.stream = {
				isInstantiated: false,
				result: 0
			};
			displayObject.isSmoothed = this.isSmoothed;
			displayObject.source = this.source;
			displayObject.keyframes = [];
			displayObject.decoded_frame = null;
		}
		selfBounds() {
			return {
				xMin: 0,
				yMin: 0,
				xMax: this.__size[0] * 20,
				yMax: this.__size[1] * 20,
			};
		}
		movie() {
			return this.__movie;
		}
		setRatio(ratio) {
			this._ratio = ratio;
		}
		seek(context, frame_id) {
			if (!this.stream.isInstantiated) {
				this.stream.result = frame_id;
				return;
			}
			var num_frames = this.source.streamdef.numFrames;
			let last_frame = this.decoded_frame ? this.decoded_frame[0] : -1;
			if (last_frame == frame_id) return;
			let is_ordered_seek = (frame_id == 0) || frame_id == (last_frame + 1);
			let sweep_from = frame_id;
			if (!is_ordered_seek) {
				var keyframes = this.keyframes;
				let prev_keyframe_id = 0;
				for (let i = frame_id; i >= 0; i--) {
					if (i in keyframes) {
						const isKeyframe = keyframes[i];
						if (!isKeyframe) {
							prev_keyframe_id = i;
							break;
						}
					}
				}
				if (last_frame !== null) {
					if (frame_id > last_frame) {
						sweep_from = Math.max(prev_keyframe_id, last_frame + 1);
					} else {
						sweep_from = prev_keyframe_id;
					}
				} else {
					sweep_from = prev_keyframe_id;
				}
			}
			var fr = sweep_from;
			while (fr <= frame_id) {
				this.seek_internal(context, fr);
				fr++;
			}
		}
		seek_internal(context, frameId) {
			if (!this.stream.isInstantiated) return;
			let stream = this.stream.result;
			var source = this.source;
			var res;
			var frame = source.frames[frameId];
			if (frame) {
				var encframe = {
					codec: source.streamdef.codec,
					data: frame,
					frameId,
				};
				try {
					res = context.video.decodeVideoStreamFrame(stream, encframe, context.renderer);
				} catch (e) {
					console.log("Got error when seeking to video frame " + frameId + ":", e);
					return;
				}
			} else {
				if (!this.decoded_frame) return;
				res = this.decoded_frame[1];
			}
			this.decoded_frame = [frameId, res];
		}
		postInstantiation(context, initObject, instantiatedBy, runFrame) {
			var source = this.source;
			var streamdef = this.source.streamdef;
			this.isSmoothed = !!streamdef.isSmoothed;
			var stream = context.video.registerVideoStream(streamdef.numFrames, [streamdef.width, streamdef.height], streamdef.codec, streamdef.codec);
			var keyframes = [];
			if (!stream.decoder) return;
			for (let i = 0; i < source.frames.length; i++) {
				var frame = source.frames[i];
				if (!frame) continue;
				let dep = context.video.preloadVideoStreamFrame(stream, {
					codec: source.streamdef.codec,
					data: frame,
					frameId: i,
				});
				keyframes[i] = !!dep;
			}
			this.keyframes = keyframes;
			var starting_seek = (this.stream.isInstantiated ? 0 : this.stream.result);
			this.stream.isInstantiated = true;
			this.stream.result = stream;
			this.seek(context, starting_seek);
		}
		preloadSwfFrame(videoframe) {
			this.source.frames[videoframe.frameNum] = videoframe.data;
		}
		renderSelf(context) {
			var decoded_frame = this.decoded_frame;
			if (decoded_frame) {
				context.transformStack.stackPush([20, 0, 0, 20, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0]);
				if (decoded_frame[1])
					context.commands.renderBitmap(decoded_frame[1], context.transformStack.getMatrix(), context.transformStack.getColorTransform(), this.isSmoothed);
				context.transformStack.stackPop();
			}
		}
		instantiate() {
			return new DisplayVideoStream(this);
		}
	}
	const typeButton = {
		up: "buttonStateUp",
		over: "buttonStateOver",
		down: "buttonStateDown",
	};
	class Avm1Button extends DisplayObjectContainer {
		constructor(data) {
			super();
			this.container = null;
			this.staticData = null;
			this._state = "up";
			this.initialized = false;
			this.displayType = "Buttom";
			this._debug_colorDisplayType = [0, 255, 0, 1];
			if (data) data.applyDisplayObject(this);
		}
		static fromSwfTag(button, sourceMovie) {
			const b = new Avm1Button();
			const staticData = new ButtonStatic();
			staticData.id = button.id;
			staticData.movie = sourceMovie.movie;
			staticData.records = button.records;
			b.staticData = staticData;
			return b;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject.staticData = this.staticData;
			displayObject.container = new ChildContainer();
		}
		rawContainer() {
			return this.container;
		}
		getId() {
			return this.staticData.id;
		}
		postInstantiation(context, initObject, instantiatedBy, runFrame) {
			this.setDefaultInstanceName(context);
			context.avm1.addExecuteList(this);
		}
		setState(context, state) {
			let library = context.library.libraryForMovie(this.movie());
			this._state = state;
			let removedDepths = [];
			let cs = this.iterRenderList();
			for (let f = 0; f < cs.length; f++) {
				const jdf = cs[f];
				const de = jdf.depth();
				removedDepths[de] = jdf;
			}
			let children = [];
			for (let i = 0; i < this.staticData.records.length; i++) {
				let record = this.staticData.records[i];
				if (record[typeButton[state]]) {
					removedDepths[record.depth] = null;
					let child = null;
					let child1 = this.childByDepth(record.depth);
					if (child1) if (child1.getId() == record.characterId) child = child1;
					if (!child) {
						child = library.instantiateById(record.characterId);
						child.setParent(context, this);
						child.setDepth(record.depth);
						children.push([record.depth, child]);
					}
					child.applyMatrix(record.matrix);
					if ("colorTransform" in record)
						child.applyColorTransform(record.colorTransform);
					if ("blendMode" in record)
						child.setBlendMode(record.blendMode);
				}
			}
			for (let k = 0; k < removedDepths.length; k++) {
				const d = removedDepths[k];
				if (d) {
					let child = this.childByDepth(k);
					if (child) {
						this.removeChild(context, child);
					}
				}
			}
			for (let o = 0; o < children.length; o++) {
				const c = children[o];
				let depth = c[0];
				let lastC = this.childByDepth(depth);
				if (lastC) this.removeChild(context, lastC);
				let child = c[1];
				child.postInstantiation(context, null, null, false);
				child.runFrameAvm1(context);
				this.replaceAtDepth(context, depth, child);
			}
		}
		avm1Unload(context) {
			this.setAvm1Removed(true);
		}
		runFrameAvm1(context) {
			if (!this.initialized) {
				this.initialized = true;
				this.setState(context, "up");
			}
		}
		renderSelf(c) {
			this.renderChildren(c);
		}
		instantiate() {
			return new Avm1Button(this);
		}
		movie() {
			return this.staticData.movie;
		}
	}
	class ButtonStatic {
		constructor() {
			this.id = 0;
			this.records = [];
			this.actions = [];
			this.upToOverSound = null;
			this.overToDownSound = null;
			this.downToOverSound = null;
			this.overToUpSound = null;
		}
	}
	function removeIdArray(array, i) {
		if (array.length) {
			if (i >= array.length) {
				array.pop();
			} else {
				array.splice(i, 1);
			}
		}
	}
	function decodeDefineBitsLossless(bitmapTag) {
		var isAlpha = bitmapTag.version == 2;
		var width = bitmapTag.width;
		var height = bitmapTag.height;
		var format = bitmapTag.format;
		var colorTableSize = 0;
		if (format === 3) colorTableSize = bitmapTag.numColors + 1;
		var sizeZLib = 5;
		var dat = ZLib.decompress(bitmapTag.data, width * height * sizeZLib, 0);
		var data = new Uint8Array(dat);
		var pxData = new Uint8Array((width * height) * 4);
		var idx = 0;
		var pxIdx = 0;
		var x = width;
		var y = height;
		if (format === 5 && !isAlpha) {
			idx = 0;
			pxIdx = 0;
			for (y = height; y--; ) {
				for (x = width; x--; ) {
					idx++;
					pxData[pxIdx++] = data[idx++];
					pxData[pxIdx++] = data[idx++];
					pxData[pxIdx++] = data[idx++];
					pxData[pxIdx++] = 255;
				}
			}
		} else {
			var bpp = isAlpha ? 4 : 3;
			var cmIdx = colorTableSize * bpp;
			var pad = 0;
			if (colorTableSize) pad = ((width + 3) & ~3) - width;
			for (y = height; y--; ) {
				for (x = width; x--; ) {
					idx = colorTableSize ? data[cmIdx++] * bpp : cmIdx++ * bpp;
					if (!isAlpha) {
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						idx++;
						pxData[pxIdx++] = 255;
					} else {
						var alpha = format === 3 ? data[idx + 3] : data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = data[idx++];
						pxData[pxIdx++] = alpha;
						if (format === 3) idx++;
					}
				}
				cmIdx += pad;
			}
		}
		return new Bitmap(width, height, "rgba", pxData);
	}
	function glueTablesToJpeg(jpedData, jpedTable) {
		if (jpedTable && jpedTable.byteLength > 4) {
			var margeData = [];
			var _jpegTables = new Uint8Array(jpedTable);
			var len = _jpegTables.length - 2;
			for (var idx = 0; idx < len; idx++)
				margeData[margeData.length] = _jpegTables[idx];
			len = jpedData.length;
			for (idx = 2; idx < len; idx++)
				margeData[margeData.length] = jpedData[idx];
			return margeData;
		} else {
			return jpedData;
		}
	}
	function removeInvalidJpegData(JPEGData) {
		var i = 0;
		var idx = 0;
		var str = "";
		var length = JPEGData.length;
		if (JPEGData[0] === 0xff && JPEGData[1] === 0xd9 && JPEGData[2] === 0xff && JPEGData[3] === 0xd8) {
			for (i = 4; i < length; i++) 
				str += String.fromCharCode(JPEGData[i]);
		} else if (JPEGData[i++] === 0xff && JPEGData[i++] === 0xd8) {
			for (idx = 0; idx < i; idx++) 
				str += String.fromCharCode(JPEGData[idx]);
			while (i < length) {
				if (JPEGData[i] === 0xff) {
					if (JPEGData[i + 1] === 0xd9 && JPEGData[i + 2] === 0xff && JPEGData[i + 3] === 0xd8) {
						i += 4;
						for (idx = i; idx < length; idx++) 
							str += String.fromCharCode(JPEGData[idx]);
						break;
					} else if (JPEGData[i + 1] === 0xda) {
						for (idx = i; idx < length; idx++) 
							str += String.fromCharCode(JPEGData[idx]);
						break;
					} else {
						var segmentLength = (JPEGData[i + 2] << 8) + JPEGData[i + 3] + i + 2;
						for (idx = i; idx < segmentLength; idx++) 
							str += String.fromCharCode(JPEGData[idx]);
						i += segmentLength - i;
					}
				}
			}
		} else {
			for (i = 0; i < length; i++) {
				str += String.fromCharCode(JPEGData[i]);
			}
		}
		return str;
	}
	function decodeDefineBitsJpeg(jpedData, alphaData, callback) {
		var fi = removeInvalidJpegData(jpedData);
		var uint8 = new Uint8Array(fi.length);
		for (let i = 0; i < uint8.length; i++) {
			uint8[i] = fi.charCodeAt(i);
		}
		try {
			AT_JPG_Decoder.parse(uint8);
			var width = AT_JPG_Decoder.width;
			var height = AT_JPG_Decoder.height;
			var pxData = new Uint8Array((width * height) * 4);
			var imgData = new Bitmap(width, height, "rgba", pxData);
			AT_JPG_Decoder.copyToImageData({
				width,
				height,
				pixels: pxData
			});
			if (alphaData) {
				var dat = ZLib.decompress(alphaData, width * height, 0);
				var adata = new Uint8Array(dat);
				var pxIdx = 3;
				var len = width * height;
				for (var i = 0; i < len; i++) {
					pxData[pxIdx] = adata[i];
					pxIdx += 4;
				}
				callback(imgData);
			} else {
				callback(imgData);
			}	
		} catch(e) {
			console.log(uint8);
			console.log(e);
			callback(null);
		}
	}
	const objectCopy = function (src) {
		const obj = {};
		for (var name in src) obj[name] = src[name];
		return obj;
	};
	class GotoPlaceObject {
		constructor(frame, place, isRewind, index) {
			this.frame = frame;
			this.place = place;
			this.isRewind = isRewind;
			this.index = index;
			this.placeData = objectCopy(place);
			if (isRewind) {
				if ("characterId" in place && !place.isMove) {
					if (!("matrix" in place)) this.placeData.matrix = [1, 0, 0, 1, 0, 0];
					if (!("colorTransform" in place)) this.placeData.colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];
					if (!("ratio" in place)) this.placeData.ratio = 0;
				}
			}
		}
		getDepth() {
			return this.placeData.depth;
		}
		merge(next) {
			let cur_place = this.placeData;
			let next_place = next.placeData;
			if ("characterId" in next_place) {
				cur_place.characterId = next_place.characterId;
				cur_place.isMove = next_place.isMove;
				this.frame = next.frame;
			}
			if ("matrix" in next_place) cur_place.matrix = next_place.matrix;
			if ("colorTransform" in next_place)
				cur_place.colorTransform = next_place.colorTransform;
			if ("visible" in next_place) cur_place.visible = next_place.visible;
			if ("ratio" in next_place) cur_place.ratio = next_place.ratio;
			if ("backgroundColor" in next_place)
				cur_place.backgroundColor = next_place.backgroundColor;
		}
	}
	class MovieClip extends DisplayObjectContainer {
		constructor(data) {
			super();

			this.staticData = null;
			this.container = null;
			this._currentFrame = 0;
			this.audioStream = null;
			this.tagStreamPos = 0;

			this.playFlag = false;
			this.loopFlag = true;
			this.INITIALIZED = false;
			this.PROGRAMMATICALLY_PLAYED = false;
			this.EXECUTING_AVM2_FRAME_SCRIPT = false;
			this.LOOP_QUEUED = false;

			this.displayType = "MovieClip";
			this._debug_colorDisplayType = [255, 0, 0, 1];
			if (data) data.applyDisplayObject(this);
		}
		static playerRootMovie(movie) {
			var numFrames = movie.numFrames;
			const mc = new MovieClip();
			mc.container = new ChildContainer();
			mc.playFlag = true;
			mc.staticData = MovieClipStatic.withData(
				0,
				SwfSlice.from(movie),
				numFrames
			);
			mc.setIsRoot(true);
			return mc;
		}
		static createNewWithData(id, swf, numFrames) {
			const mc = new MovieClip();
			mc.staticData = MovieClipStatic.withData(id, swf, numFrames);
			mc.playFlag = true;
			return mc;
		}
		applyDisplayObject(displayObject) {
			super.applyDisplayObject(displayObject);
			displayObject.staticData = this.staticData;
			displayObject.container = new ChildContainer();
			displayObject._currentFrame = this._currentFrame;
			displayObject.playFlag = this.playFlag;
			displayObject.loopFlag = this.loopFlag;
			displayObject.INITIALIZED = this.INITIALIZED;
			displayObject.PROGRAMMATICALLY_PLAYED = this.PROGRAMMATICALLY_PLAYED;
			displayObject.EXECUTING_AVM2_FRAME_SCRIPT = this.EXECUTING_AVM2_FRAME_SCRIPT;
			displayObject.LOOP_QUEUED = this.LOOP_QUEUED;
		}
		totalframes() {
			return this.staticData.totalframes;
		}
		framesloaded() {
			return this.staticData.preloadProgress.curPreloadFrame - 1;
		}
		movie() {
			return this.staticData.swf.movie;
		}
		currentFrame() {
			return this._currentFrame;
		}
		setCurrentFrame(frame) {
			this._currentFrame = frame;
		}
		isPlaying() {
			return this.playFlag;
		}
		setIsPlaying(bool) {
			this.playFlag = bool;
		}
		isLoop() {
			return this.loopFlag;
		}
		setIsLoop(bool) {
			this.loopFlag = bool;
		}
		rawContainer() {
			return this.container;
		}
		getId() {
			return this.staticData.id;
		}
		postInstantiation(context, initObject, instantiatedBy, runFrame) {
			this.setDefaultInstanceName(context);
			context.avm1.addExecuteList(this);
		}
		preload(context, chunkLimit) {
			const staticData = this.staticData;
			const preloadProgress = staticData.preloadProgress;
			var nextPreloadChunk = preloadProgress.nextPreloadChunk;
			var curPreloadSymbol = preloadProgress.curPreloadSymbol;
			if (nextPreloadChunk < 0) return true;
			var g = staticData.swf.readFrom(nextPreloadChunk);
			if (curPreloadSymbol !== null) {
				var preloadSymbol = context.library.libraryForMovieMut(this.movie()).characterById(curPreloadSymbol);
				let sub_preload_done = preloadSymbol.preload(context, chunkLimit);
				if (sub_preload_done) {
					preloadProgress.curPreloadSymbol = null;
				}
			}
			let endTagFound = false;
			let subPreloadDone = preloadProgress.curPreloadSymbol === null;
			const tagCallback = function (reader, tagCode, tagLength) {
				switch (tagCode) {
					case 0:
						endTagFound = true;
						return true;
					case 1:
						preloadProgress.curPreloadFrame += 1;
						staticData.timelineTags.push("next");
						break;
					case 2:
						this.defineShape(context, reader, 1);
						break;
					case 22:
						this.defineShape(context, reader, 2);
						break;
					case 32:
						this.defineShape(context, reader, 3);
						break;
					case 83:
						this.defineShape(context, reader, 4);
						break;
					case 14:
						this.defineSound(context, reader, tagLength);
						break;
					case 46:
						this.defineMorphShape(context, reader, 1);
						break;
					case 84:
						this.defineMorphShape(context, reader, 2);
						break;
					case 11:
						this.defineText(context, reader, 1);
						break;
					case 33:
						this.defineText(context, reader, 2);
						break;
					case 10:
						this.defineFont(context, reader, 1, tagLength);
						break;
					case 48:
						this.defineFont(context, reader, 2, tagLength);
						break;
					case 75:
						this.defineFont(context, reader, 3, tagLength);
						break;
					case 91:
						this.defineFont(context, reader, 4, tagLength);
						break;
					case 37:
						this.defineEditText(context, reader);
						break;
					case 7:
						this.defineButton1(context, reader, tagLength);
						break;
					case 34:
						this.defineButton2(context, reader, tagLength);
						break;
					case 20:
						this.defineBitsLossless(context, reader, 1, tagLength);
						break;
					case 36:
						this.defineBitsLossless(context, reader, 2, tagLength);
						break;
					case 8:
						this.jpegTables(context, reader, tagLength);
						break;
					case 60:
						this.defineVideoStream(context, reader);
						break;
					case 61:
						this.preloadVideoFrame(context, reader, tagLength, chunkLimit);
						break;
					case 18:
						this.soundStreamHead(reader, staticData, 1);
						break;
					case 45:
						this.soundStreamHead(reader, staticData, 2);
						break;
					case 19:
						staticData.timelineTags.push([5, reader.parseSoundStreamBlock(tagLength).compressed]);
						break;
					case 6:
						this.defineBits(context, reader, 1, tagLength);
						break;
					case 21:
						this.defineBits(context, reader, 2, tagLength);
						break;
					case 35:
						this.defineBits(context, reader, 3, tagLength);
						break;
					case 90:
						this.defineBits(context, reader, 4, tagLength);
						break;
					case 4:
						staticData.timelineTags.push([1, reader.parsePlaceObject(1, tagLength)]);
						break;
					case 26:
						staticData.timelineTags.push([1, reader.parsePlaceObject(2, tagLength)]);
						break;
					case 70:
						staticData.timelineTags.push([1, reader.parsePlaceObject(3, tagLength)]);
						break;
					case 94:
						staticData.timelineTags.push([1, reader.parsePlaceObject(4, tagLength)]);
						break;
					case 5:
						staticData.timelineTags.push([2, reader.parseRemoveObject(1)]);
						break;
					case 28:
						staticData.timelineTags.push([2, reader.parseRemoveObject(2)]);
						break;
					case 15:
						staticData.timelineTags.push([3, reader.parseStartSound(1)]);
						break;
					case 9:
						staticData.timelineTags.push([4, reader.rgb()]);
						break;
					case 39:
						return this.defineSprite(context, reader, tagLength, chunkLimit);
				}
				if (chunkLimit.didOpsBreachLimit(context, tagLength)) {
					return true;
				}
				return false;
			};
			var result;
			if (subPreloadDone) {
				result = decodeTags(g, tagCallback.bind(this));
			} else {
				result = true;
			}
			if (subPreloadDone) {
				preloadProgress.nextPreloadChunk = g.input.position;
			}
			if (endTagFound) {
				if (staticData.audioStreamInfo) {
					staticData.audioStreamHandle = context.audio.loadStreamSound(staticData.audioStreamInfo, staticData.timelineTags);
				}
			}
			var is_finished = endTagFound;
			if (is_finished) {
				preloadProgress.nextPreloadChunk = -1;
			}
			return is_finished;
		}
		play(context) {
			if (this.totalframes() > 1) {
				this.playFlag = true;
			}
		}
		stop(context) {
			this.playFlag = false;
			this.stopAudioStream(context);
		}
		stopAudioStream(context) {
			if (this.audioStream) {
				context.audio.stopStreamSound(this.audioStream);
			}
		}
		getTotalBytes() {
			if (this.isRoot()) {
				return this.movie().uncompressedLength;
			} else {
				return this.tagStreamLen();
			}
		}
		getLoadedBytes() {
			if (this.staticData.preloadProgress.nextPreloadChunk < 0) {
				return this.getTotalBytes();
			} else {
				return this.staticData.preloadProgress.nextPreloadChunk;
			}
		}
		tagStreamLen() {
			return this.staticData.swf.end - this.staticData.swf.start;
		}
		runFrameAvm1(context) {
			var isLoadFrame = !this.INITIALIZED;
			if (isLoadFrame) this.INITIALIZED = true;
			if (this.isPlaying()) this.runIntervalFrame(context, true, true);
		}
		determineNextFrame() {
			if (this.currentFrame() < this.totalframes()) {
				return "next";
			} else if (this.totalframes() > 1) {
				return "first";
			} else {
				return "same";
			}
		}
		setLoopQueued() {
			this.LOOP_QUEUED = true;
		}
		unsetLoopQueued() {
			this.LOOP_QUEUED = false;
		}
		gotoPlaceObject(context, place, gotoCommands, isRewind, index) {
			const depth = place.depth;
			const gotoPlace = new GotoPlaceObject(this._currentFrame, place, isRewind, index);
			for (let i = 0; i < gotoCommands.length; i++) {
				const gc = gotoCommands[i];
				if (gc.getDepth() == depth) {
					gc.merge(gotoPlace);
					return;
				}
			}
			gotoCommands.push(gotoPlace);
		}
		runIntervalFrame(context, runDisplayAction, runSounds) {
			const nextFrame = this.determineNextFrame();
			switch (nextFrame) {
				case "next":
					this._currentFrame++;
					if ((!this.loopFlag) && (this._currentFrame == this.totalframes())) {
						this.stop();
					}
					break;
				case "first":
					this.runGoto(context, 1, true);
					return;
				case "same":
					this.stop(context);
					break;
			}
			let pos = this.tagStreamPos;
			while (pos < this.staticData.timelineTags.length) {
				let rTag = this.staticData.timelineTags[pos];
				if (rTag == "next") {
					pos++;
					break;
				}
				let typ = rTag[0];
				switch (typ) {
					case 1:
						if (runDisplayAction) this.placeObject(context, rTag[1]);
						break;
					case 2:
						if (runDisplayAction) this.removeObject(context, rTag[1]);
						break;
					case 3:
						if (runSounds) this.startSound1(context, rTag[1]);
						break;
					case 4:
						this.set_background_color(context, rTag[1]);
						break;
					case 5:
						if (runSounds) this.soundStreamBlock(context, rTag[1]);
						break;
				}
				pos++;
			}
			this.tagStreamPos = pos;
			if (this.audioStream) {
				if (!context.audio.isSoundPlaying(this.audioStream)) {
					this.audioStream = null;
				}
			}
		}
		runGoto(context, frame, isImplicit) {
			let frameBeforeRewind = this.currentFrame();
			this.setSkipNextEnterFrame(false);
			let gotoCommands = [];
			this.stopAudioStream(context);
			let isRewind = frame <= this._currentFrame;
			if (isRewind) {
				this.tagStreamPos = 0;
				this._currentFrame = 0;
			}
			let fromFrame = this._currentFrame;
			if (isImplicit) this.setLoopQueued();
			let index = 0;
			let clamped_frame = frame;
			let pos = this.tagStreamPos;
			let frame_pos = pos;
			while (this._currentFrame < clamped_frame) {
				this._currentFrame++;
				frame_pos = pos;
				while (pos < this.staticData.timelineTags.length) {
					let rTag = this.staticData.timelineTags[pos];
					if (rTag == "next") {
						pos++;
						break;
					}
					let typ = rTag[0];
					switch (typ) {
						case 1:
							index++;
							this.gotoPlaceObject(context, rTag[1], gotoCommands, isRewind, index);
							break;
						case 2:
							this.gotoRemoveObject(context, rTag[1], gotoCommands, isRewind, fromFrame);
							break;
					}
					pos++;
				}
			}
			let hitTargetFrame = this._currentFrame == frame;
			if (isRewind) {
				let children = this.iterRenderList().filter(function (clip) {
					return clip.placeFrame() > frame;
				});
				for (let i = 0; i < children.length; i++) {
					let child = children[i];
					this.removeChild(context, child);
				}
			}
			let run_goto_command = (params) => {
				let child_entry = this.childByDepth(params.getDepth());
				let place = params.placeData;
				if (child_entry) {
					if ("characterId" in place) {
						child_entry.replaceWith(context, place.characterId);
						child_entry.applyPlaceObject(context, place);
						child_entry.setPlaceFrame(params.frame);
					} else {
						if (place.isMove) {
							child_entry.applyPlaceObject(context, place);
						}
					}
				} else {
					if ("characterId" in place) {
						let clip = this.instantiateChild(
							context,
							place.characterId,
							params.getDepth(),
							place
						);
						if (clip) clip.setPlaceFrame(params.frame);
					} else {
						console.log("Unexpected PlaceObject during goto", params);
						if (place.isMove) {
						}
					}
				}
			};
			gotoCommands.filter(function (params) {
				return params.frame < frame;
			}).forEach((goto) => {
				run_goto_command(goto);
			});
			if (hitTargetFrame) {
				this._currentFrame--;
				this.tagStreamPos = frame_pos;
				this.runIntervalFrame(context, false, frame != frameBeforeRewind);
			} else {
				this.setCurrentFrame(clamped_frame);
			}
			gotoCommands.filter(function (params) {
				return params.frame >= frame;
			}).forEach((goto) => {
				run_goto_command(goto);
			});
		}
		nextFrame(context) {
			if (this.currentFrame() < this.totalframes()) {
				this.gotoFrame(context, this.currentFrame() + 1, true);
			}
		}
		prevFrame(context) {
			if (this.currentFrame() > 1) {
				this.gotoFrame(context, this.currentFrame() - 1, true);
			}
		}
		gotoFrame(context, frame, stop) {
			if (stop) this.stop(context);
			else this.play(context);
			var _frame = Math.max(frame, 1);
			if (_frame != this.currentFrame()) {
				this.runGoto(context, _frame, false);
			}
		}
		gotoRemoveObject(context, place, gotoCommands, isRewind, fromFrame) {
			var depth = place.depth;
			for (let i = 0; i < gotoCommands.length; i++) {
				const gc = gotoCommands[i];
				if (gc.getDepth() == depth) {
					removeIdArray(gotoCommands, i);
					break;
				}
			}
			if (!isRewind) {
				let to_frame = this.currentFrame();
				this.setCurrentFrame(fromFrame);
				var child = this.childByDepth(depth);
				if (child) {
					this.removeChild(context, child);
				}
				this.setCurrentFrame(to_frame);
			}
		}
		instantiateChild(context, id, depth, place) {
			let child = context.library.libraryForMovieMut(this.movie()).instantiateById(id);
			if (child) {
				let prevChild = this.replaceAtDepth(context, depth, child);
				child.setInstantiatedByTimeline(true);
				child.setDepth(depth);
				child.setParent(context, this);
				child.setPlaceFrame(this.currentFrame());
				child.applyPlaceObject(context, place);
				if ("name" in place) {
					child.setName(place.name);
				}
				if ("clipDepth" in place) {
					child.setClipDepth(place.clipDepth);
				}
				child.postInstantiation(context, null, "movie", false);
				child.enterFrame(context);
				child.runFrameAvm1(context);
			} else {
				console.log("Unable to instantiate display node id, reason being");
			}
			return child;
		}
		enterFrame(context) {
			let skipFrame = this.shouldSkipNextEnterFrame();
			var children = this.iterRenderList();
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (skipFrame) {
					child.setSkipNextEnterFrame(true);
				}
				child.enterFrame(context);
			}
			if (skipFrame) {
				this.setSkipNextEnterFrame(false);
			}
		}
		avm1Unload(context) {
			var children = this.iterRenderList();
			for (let i = 0; i < children.length; i++) {
				children[i].avm1Unload(context);
			}
			this.stopAudioStream(context);
			this.setAvm1Removed(true);
		}
		instantiate() {
			return new MovieClip(this);
		}
		// Preloading of definition tags
		defineSprite(context, reader, tagLength, chunkLimit) {
			const movie = this.movie();
			let id = reader.input.readUint16();
			let numFrames = reader.input.readUint16();
			let movieClip = MovieClip.createNewWithData(id, this.staticData.swf.resizeToReader(reader, tagLength - 4), numFrames);
			context.library.libraryForMovieMut(movie).registerCharacter(id, movieClip);
			this.staticData.preloadProgress.curPreloadSymbol = id;
			let should_exit = chunkLimit.didOpsBreachLimit(context, 4);
			if (should_exit)
				return true;
			if (movieClip.preload(context, chunkLimit)) {
				this.staticData.preloadProgress.curPreloadSymbol = null;
				return false;
			} else {
				return true;
			}
		}
		defineShape(context, reader, version) {
			const movie = this.movie();
			let swfShape = reader.parseDefineShape(version);
			let id = swfShape.id;
			let graphic = Graphic.fromSwfTag(context, swfShape, movie);
			context.library.libraryForMovieMut(movie).registerCharacter(id, graphic);
		}
		defineMorphShape(context, reader, version) {
			const movie = this.movie();
			let tag = reader.parseDefineMorphShape(version);
			let id = tag.id;
			let morph_shape = MorphShape.fromSwfTag(tag, movie);
			context.library.libraryForMovieMut(movie).registerCharacter(id, morph_shape);
		}
		defineText(context, reader, version) {
			const movie = this.movie();
			let text = reader.parseDefineText(version);
			let textObject = StaticText.fromSwfTag(context, movie, text);
			context.library.libraryForMovieMut(movie).registerCharacter(text.id, textObject);
		}
		defineFont(context, reader, version, tagLength) {
			const movie = this.movie();
			let font;
			switch (version) {
				case 1:
					font = reader.parseDefineFont1(tagLength);
					break;
				case 2:
					font = reader.parseDefineFont2(2, tagLength);
					break;
				case 3:
					font = reader.parseDefineFont2(3, tagLength);
					break;
				case 4:
					font = reader.parseDefineFont4(tagLength);
					break;
			}
			let fontId = font.id;
			let fontObject = FlashFont.fromSwfTag(context.renderer, font);
			context.library.libraryForMovieMut(movie).registerCharacter(fontId, fontObject);
		}
		defineButton1(context, reader, tagLength) {
			let swfButton = reader.parseDefineButton(1, tagLength);
			this.defineButtonAny(context, swfButton);
		}
		defineButton2(context, reader, tagLength) {
			let swfButton = reader.parseDefineButton(2, tagLength);
			this.defineButtonAny(context, swfButton);
		}
		defineButtonAny(context, swfButton) {
			const movie = this.movie();
			let button = Avm1Button.fromSwfTag(swfButton, this.staticData.swf);
			let library = context.library.libraryForMovieMut(movie);
			library.registerCharacter(swfButton.id, button);
		}
		defineEditText(context, reader) {
			const movie = this.movie();
			let swf_edit_text = reader.parseDefineEditText();
			let edit_text = TextField.fromSwfTag(context, movie, swf_edit_text);
			let library = context.library.libraryForMovieMut(movie);
			library.registerCharacter(swf_edit_text.id, edit_text);
		}
		defineBitsLossless(context, reader, version, tagLength) {
			const movie = this.movie();
			let define_bits_lossless = reader.parseDefineBitsLossLess(version, tagLength);
			let bitmap = decodeDefineBitsLossless(define_bits_lossless);
			let imageInterval = context.renderer.createImageInterval();
			imageInterval.setImage(bitmap);
			let _bitmap = BitmapGraphic.createNew(
				context,
				define_bits_lossless.id,
				imageInterval
			);
			let library = context.library.libraryForMovieMut(movie);
			library.registerCharacter(define_bits_lossless.id, _bitmap);
		}
		jpegTables(context, reader, length) {
			const movie = this.movie();
			let jpeg_data = reader.input.readBytes(length);
			let library = context.library.libraryForMovieMut(movie);
			library.setJpegTables(jpeg_data);
		}
		defineBits(context, reader, version, length) {
			const movie = this.movie();
			let library = context.library.libraryForMovieMut(movie);
			let swfBits = reader.parseDefineBits(version, length);
			let jpeg_tables = version == 1 ? library.jpegTables : null;
			let jpeg_data = glueTablesToJpeg(new Uint8Array(swfBits.data), jpeg_tables);
			let imageInterval = context.renderer.createImageInterval();
			let _bitmap = BitmapGraphic.createNew(context, swfBits.id, imageInterval);
			library.registerCharacter(swfBits.id, _bitmap);
			decodeDefineBitsJpeg(jpeg_data, swfBits.alphaData, function (bitmap) {
				if (bitmap) imageInterval.setImage(bitmap);
			});
		}
		defineVideoStream(context, reader) {
			const movie = this.movie();
			let streamdef = reader.parseDefineVideoStream();
			let id = streamdef.id;
			let video = DisplayVideoStream.fromSwfTag(movie, streamdef);
			let library = context.library.libraryForMovieMut(movie);
			library.registerCharacter(id, video);
		}
		preloadVideoFrame(context, reader, length, chunkLimit) {
			let vframe = reader.parseVideoFrame(length);
			const movie = this.movie();
			let library = context.library.libraryForMovieMut(movie);
			let v = library.characterById(vframe.streamId);
			if (v) v.preloadSwfFrame(vframe);
		}
		soundStreamHead(reader, staticData, version) {
			staticData.audioStreamInfo = reader.parseSoundStreamHead(version);
		}
		defineSound(context, reader, length) {
			const swfSound = reader.parseDefineSound(length);
			var library = context.library.libraryForMovieMut(this.movie());
			var handle = context.audio.registerSound(swfSound);
			library.registerCharacter(swfSound.id, handle);
		}
		showFrame() { }
		// Control tags
		doAction(context, tag) { }
		placeObject(context, place) {
			if ("characterId" in place) {
				if (place.isMove) {
					var child = this.childByDepth(place.depth);
					if (child) {
						child.replaceWith(context, place.characterId);
						child.applyPlaceObject(context, place);
						child.setPlaceFrame(this.currentFrame());
					}
				} else {
					this.instantiateChild(context, place.characterId, place.depth, place);
				}
			} else {
				if (place.isMove) {
					var child = this.childByDepth(place.depth);
					if (child) child.applyPlaceObject(context, place);
				}
			}
		}
		queuePlaceObject(context, tag) { }
		removeObject(context, tag) {
			var child = this.childByDepth(tag.depth);
			if (child) {
				this.removeChild(context, child);
			}
		}
		queueRemoveObject(context, tag) { }
		soundStreamBlock(context, block) {
			if (this.isPlaying() && this.staticData.audioStreamInfo && this.staticData.audioStreamHandle) {
				let audioStream = context.audio.startStream(this.staticData.audioStreamHandle, this, this._currentFrame, block, this.staticData.audioStreamInfo);
				this.audioStream = audioStream;
			}
		}
		startSound1(context, tag) {
			var handle = context.library.libraryForMovie(this.movie()).characterById(tag.id);
			if (handle) {
				var soundInfo = tag.info;
				switch (soundInfo.event) {
					case "event":
						context.audio.startSound(handle, tag.info, this);
						break;
					case "start":
						if (!context.audio.isSoundPlayingWithHandle(handle))
							context.audio.startSound(handle, tag.info, this);
						break;
					case "stop":
						context.audio.stopSoundsWithHandle(handle);
						break;
				}
			}
		}
		set_background_color(context, background_color) {
			if (!context.stage.getBackgroundColor()) {
				context.stage.setBackgroundColor(background_color);
			}
		}
	}
	class PreloadProgress {
		constructor() {
			this.nextPreloadChunk = 0;
			this.curPreloadFrame = 1;
			this.lastFrameStartPos = 0;
			this.curPreloadSymbol = null;
		}
	}
	class MovieClipStatic {
		constructor() {
			this.id = 0;
			this.swf = null;
			this.totalframes = 0;
			this.exportedName = null;
			this.preloadProgress = new PreloadProgress();
			this.audioStreamInfo = null;
			this.audioStreamHandle = null;
			this.timelineTags = [];
		}
		static withData(id, swf, totalFrames) {
			var mcs = new MovieClipStatic();
			mcs.id = id;
			mcs.swf = swf;
			mcs.totalframes = totalFrames;
			return mcs;
		}
	}
	class Avm1 {
		constructor() {
			this.clipExecList = null;
		}
		runFrame(context) {
			var prev = null;
			var next = this.clipExecList;
			while (true) {
				var clip = next;
				if (!clip) break;
				next = clip.nextAvm1Clip();
				if (clip.avm1Removed()) {
					if (prev) {
						prev.setNextAvm1Clip(next);
					} else {
						this.clipExecList = next;
					}
					clip.setNextAvm1Clip(null);
				} else {
					clip.runFrameAvm1(context);
					prev = clip;
				}
			}
		}
		addExecuteList(clip) {
			if (!clip.nextAvm1Clip()) {
				clip.setNextAvm1Clip(this.clipExecList);
				this.clipExecList = clip;
			}
		}
	}
	class RawDecoder {
		constructor(data, isStereo, is16Bit) {
			this.input = new ByteInput(data);
			this.isStereo = isStereo;
			this.is16Bit = is16Bit;
			this.l = 0;
			this.r = 0;
		}
		readSample() {
			return this.is16Bit ? this.input.readInt16() / 32768 : (this.input.readUint8() - 128) / 128;
		}
		next() {
			try {
				if (!this.isEnd) {
					let left = this.readSample(), right = this.isStereo ? this.readSample() : left;
					this.l = left, this.r = right;
				}
			} catch (e) {
				this.isEnd = true;
				this.l = 0;
				this.r = 0;
			}
		}
	}
	class BitReader {
		constructor(vec) {
			this.vec = vec;
			this.bytePos = 0;
			this.bitPos = 0;
		}
		readUB(n) {
			var value = 0;
			while (n--) value <<= 1, value |= this.readBit();
			return value;
		}
		readSB(n) {
			var uval = this.readUB(n);
			var shift = 32 - n;
			return (uval << shift) >> shift;
		}
		readBit() {
			var val = (this.vec[this.bytePos] >> (7 - this.bitPos++)) & 0x1;
			if (this.bitPos > 7) {
				this.bytePos++;
				this.bitPos = 0;
			}
			return val;
		}
	}
	class AdpcmDecoder {
		constructor(data, isStereo) {
			this.input = new BitReader(new Uint8Array(data));
			this.channels = isStereo ? 2 : 1;
			this.c = [{}, {}];
			this.bits_per_sample = this.input.readUB(2) + 2;
			this.decoder = AdpcmDecoder.SAMPLE_DELTA_CALCULATOR[this.bits_per_sample - 2];
			this.l = 0;
			this.r = 0;
			this.isEnd = false;
			this.sample_num = 0;
		}
		next() {
			const j = this.input, m = this.bits_per_sample, d = this.decoder, _ = this.c, s = this.channels, h = 1 << (m - 1), n = AdpcmDecoder.INDEX_TABLE[m - 2];
			try {
				if (!this.isEnd) {
					if (this.sample_num == 0) {
						for (let i = 0; i < s; i++) {
							let w = _[i];
							w.sample = j.readSB(16);
							w.stepIndex = j.readUB(6);
						}
					}
					this.sample_num = (this.sample_num + 1) % 4095;
					for (let i2 = 0; i2 < s; i2++) {
						let w = _[i2];
						let r = AdpcmDecoder.STEP_TABLE[w.stepIndex];
						let p = j.readUB(m);
						let g = p & (h - 1);
						let delta = d(r, g);
						w.sample = Math.max(-32768, Math.min(32767, w.sample + (p & h ? -delta : delta)));
						w.stepIndex = Math.max(0, Math.min(88, w.stepIndex + n[g]));
					}
					this.l = _[0].sample / 0x8000;
					this.r = s == 2 ? _[1].sample / 0x8000 : this.l;
				}
			} catch (e) {
				this.isEnd = true;
				this.l = 0;
				this.r = 0;
			}
		}
	}
	AdpcmDecoder.INDEX_TABLE = [new Int16Array([-1, 2]), new Int16Array([-1, -1, 2, 4]), new Int16Array([-1, -1, -1, -1, 2, 4, 6, 8]), new Int16Array([-1, -1, -1, -1, -1, -1, -1, -1, 1, 2, 4, 6, 8, 10, 13, 16])];
	AdpcmDecoder.STEP_TABLE = new Uint16Array([7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767]);
	AdpcmDecoder.SAMPLE_DELTA_CALCULATOR = [
		function (a, b) {
			let c = a >> 1;
			if (b & 1) c += a;
			return c;
		},
		function (a, b) {
			let c = a >> 2;
			if (b & 1) c += a >> 1;
			if (b & 2) c += a;
			return c;
		},
		function (a, b) {
			let c = a >> 3;
			if (b & 1) c += a >> 2;
			if (b & 2) c += a >> 1;
			if (b & 4) c += a;
			return c;
		},
		function (a, b) {
			let c = a >> 4;
			if (b & 1) c += a >> 3;
			if (b & 2) c += a >> 2;
			if (b & 4) c += a >> 1;
			if (b & 8) c += a;
			return c;
		},
	];
	function decodePCM(data, channels, is16Bit, pos_buffer, sample_length, left, right) {
		const raw = new RawDecoder(data, channels == 2, is16Bit);
		var _pos_buffer = pos_buffer || 0;
		var i = _pos_buffer;
		while (i - _pos_buffer < sample_length) {
			raw.next();
			left[i] = raw.l;
			if (channels == 2) right[i] = raw.r;
			i++;
		}
		return i;
	}
	function decodeADPCM(data, channels, pos_buffer, sample_length, left, right) {
		const adpcm = new AdpcmDecoder(data, channels == 2);
		var _ = pos_buffer || 0;
		var q = _;
		while (q - _ < sample_length) {
			adpcm.next();
			left[q] = adpcm.l;
			if (channels == 2) right[q] = adpcm.r;
			q++;
		}
		return q;
	}
	function getMP3Header(stream, header) {
		var mp3FrameHeader = header;
		while (stream.bytesAvailable > 4) {
			var frameStart = stream.position;
			var header = stream.readInt32();
			if (AT_MP3_Decoder.Header.isValidHeader(header)) {
				mp3FrameHeader.parseHeader(header);
				return mp3FrameHeader;
			}
			stream.position = frameStart + 1;
		}
		return null;
	}
	function decodeMP3(audioContext, data, numSamples, useSeekSample) {
		var decoder = new AT_MP3_Decoder.Decoder();
		var bitstream = new AT_MP3_Decoder.BitStream();
		var byteStream = new ByteInput(data);
		byteStream.littleEndian = true;
		var seekSample = useSeekSample == undefined ? byteStream.readInt16() : useSeekSample;
		byteStream.littleEndian = false;
		var header = new AT_MP3_Decoder.Header();
		var startPos = byteStream.position;
		getMP3Header(byteStream, header);
		byteStream.position = startPos;
		var channels = header.mode() == AT_MP3_Decoder.Header.SINGLE_CHANNEL ? 1 : 2;
		var buffer = audioContext.createBuffer(channels, numSamples, header.frequency());
		var channelData0 = buffer.getChannelData(0);
		var channelData1 = (channels == 2) ? buffer.getChannelData(1): null;
		var idx1 = 0;
		var idx2 = 0;
		var sampleId = 0;
		while(byteStream.bytesAvailable > 4) {
			getMP3Header(byteStream, header);
			var eeee = header.framesize;
			if (!((byteStream.bytesAvailable - eeee) > 4)) 
				break;
			var frameStream = byteStream.readBytes(eeee);
			bitstream.setData(new Uint8Array(frameStream));
			var buf = decoder.decodeFrame(header, bitstream);
			var pcm = buf.getBuffer();
			var sc = ((header.version() == AT_MP3_Decoder.Header.MPEG1) ? 1152 : 576) * channels;
			for (var i = 0; i < sc; i += channels) {
				if ((sampleId >= seekSample) && sampleId < (seekSample + numSamples)) {
					if (channels == 2) {
						channelData0[idx1++] = (pcm[i] / 32768);
						channelData1[idx2++] = (pcm[i + 1] / 32768);
					} else {
						channelData0[idx1++] = (pcm[i] / 32768);
					}	
				}
				sampleId++;
			}
		}
		return buffer;
	}
	function getMP3Sample(blocks) {
		var s = 0;
		for (let i = 0; i < blocks.length; i++) {
			const block = blocks[i];
			var _in = new ByteInput(block);
			s += _in.readUint16();
		}
		return s;
	}
	function decodeMP3SoundStream(audioContext, blocks, streamInfo) {
		var numSamples = getMP3Sample(blocks);
		var gg1 = 0;
		for (var i = 0; i < blocks.length; i++) gg1 += blocks[i].byteLength - 4;
		var gg = new Uint8Array(gg1);
		var idd = 0;
		for (var i = 0; i < blocks.length; i++) {
			var ui8view = new Uint8Array(blocks[i], 4);
			gg.set(ui8view, idd);
			idd += ui8view.length;
		}
		var compressed = gg.buffer;
		if (compressed.byteLength) {
			return decodeMP3(audioContext, compressed, numSamples, streamInfo.latencySeek || 0);
		} else {
			return audioContext.createBuffer(1, 1, audioContext.sampleRate);
		}
	}
	function decodeNellymoser(b, k) {
		var z = 0, x = new Float32Array(128), r = 0, c = new Float32Array(256);
		while (r < b.byteLength) {
			AT_Nellymoser_Decoder.decode(x, new Uint8Array(b.slice(r, r + 64)), c);
			for (let i = 0; i < 256; i++) (k[z] = c[i] / 32768), z++;
			r += 64;
		}
	}
	function loadDefineSound(audioContext, sound) {
		var format = sound.format;
		var data = sound.data;
		var numSamples = sound.numSamples;
		var channels = format.isStereo ? 2 : 1;
		var is16Bit = format.is16Bit;
		var buffer;
		if (format.compression == "MP3") {
			buffer = decodeMP3(audioContext, data, numSamples);
		} else {
			buffer = audioContext.createBuffer(channels, numSamples, format.sampleRate);
			let a = buffer.getChannelData(0);
			let s = channels == 2 ? buffer.getChannelData(1) : null;
			switch (format.compression) {
				case "ADPCM":
					decodeADPCM(data, channels, 0, numSamples, a, s);
					break;
				case "uncompressed":
				case "uncompressedUnknownEndian":
					decodePCM(data, channels, is16Bit, 0, numSamples, a, s);
					break;
				case "nellymoser":
					decodeNellymoser(data, a);
					break;
				default:
					console.log("TODO: " + format.compression);
			}
		}
		return buffer;
	}
	function loadStreamSound(audioContext, blocks, streamInfo) {
		var streamStream = streamInfo.stream;
		var compression = streamStream.compression;
		var samplePerBlock = streamInfo.samplePerBlock;
		var numSamples = blocks.length * streamInfo.samplePerBlock;
		var channels = streamStream.isStereo ? 2 : 1;
		var is16Bit = streamStream.is16Bit;
		var buffer;
		if (compression == "MP3") {
			buffer = decodeMP3SoundStream(audioContext, blocks, streamInfo);
		} else {
			buffer = audioContext.createBuffer(channels, numSamples, streamStream.sampleRate);
			let a = buffer.getChannelData(0);
			let s = channels == 2 ? buffer.getChannelData(1) : null;
			if (compression == "nellymoser") {
				var gg1 = 0;
				for (var i = 0; i < blocks.length; i++) gg1 += blocks[i].byteLength;
				var gg = new Uint8Array(gg1);
				var idd = 0;
				for (var i = 0; i < blocks.length; i++) {
					var ui8view = new Uint8Array(blocks[i]);
					gg.set(ui8view, idd);
					idd += ui8view.length;
				}
				var compressed = gg.buffer;
				decodeNellymoser(compressed, a);
			} else {
				var oPos = 0;
				for (let i = 0; i < blocks.length; i++) {
					const block = blocks[i];
					var posBuffer = 0;
					switch (compression) {
						case "ADPCM":
							posBuffer = decodeADPCM(block, channels, oPos, samplePerBlock, a, s);
							break;
						case "uncompressed":
						case "uncompressedUnknownEndian":
							posBuffer = decodePCM(block, channels, is16Bit, oPos, samplePerBlock, a, s);
							break;
						default:
							console.log("TODO: " + compression);
					}
					oPos = posBuffer;
				}
			}
		}
		return buffer;
	}
	function loadStreamSoundTimeline(audioContext, tags, streamInfo) {
		var streamSounds = [];
		var blocks = [];
		var frameCount = 0;
		var startFrame = 0;
		var streamBlock = null;
		var tagId = 0;
		while (tagId < tags.length) {
			var tag = tags[tagId++];
			if (tag == "next") {
				frameCount++;
				if (streamBlock) {
					if (!blocks.length) startFrame = frameCount;
					blocks.push(streamBlock);
					streamBlock = null;
				} else {
					if (blocks.length) {
						streamSounds.push({
							startFrame,
							blocks,
						});
						blocks = [];
					}
				}
			} else {
				if (tag[0] == 5) streamBlock = tag[1];
			}
		}
		if (blocks.length) {
			streamSounds.push({
				startFrame,
				blocks,
			});
			blocks = [];
		}
		var buffers = [];
		var s = 0;
		if (streamSounds.length) {
			for (let l = 0; l < streamSounds.length; l++) {
				var currentStreamSound = streamSounds[l];
				var buffer = loadStreamSound(audioContext, currentStreamSound.blocks, streamInfo);
				buffers.push({
					blocks: currentStreamSound.blocks,
					buffer: buffer,
					startFrame: s,
				});
				s += currentStreamSound.blocks.length;
			}
		}
		return buffers;
	}
	class Sound {
		constructor(buffer, format) {
			this.buffer = buffer;
			this.format = format;
		}
		getBuffer() {
			return this.buffer;
		}
	}
	class SoundStream {
		constructor(streamSounds, streamInfo) {
			this.streamSounds = streamSounds;
			this.format = streamInfo;
		}
		getBlock(block) {
			for (let i = 0; i < this.streamSounds.length; i++) {
				const sg = this.streamSounds[i];
				for (let j = 0; j < sg.blocks.length; j++) {
					const _block = sg.blocks[j];
					if (_block == block) {
						return {
							buffer: sg.buffer,
							blocks: sg.blocks,
							timeFrame: j,
						};
					}
				}
			}
			return null;
		}
	}
	class AudioBackend {
		constructor() {
			this.audioContext = new AudioContext();
			this.playingAudios = [];
			this.node = this.audioContext.createGain();
			this.node.gain.value = 1;
			this.node.connect(this.audioContext.destination);
			this.frameRate = 6;
			this.compressSoundMap = {};
		}
		getCompressSound() {
			return Object.keys(this.compressSoundMap);
		}
		play() {
			this.audioContext.resume();
		}
		pause() {
			this.audioContext.suspend();
		}
		getAudioBufferFloat(bufferLeft, bufferRight, sampleRate) {
			bufferLeft.fill(0);
			bufferRight.fill(0);
			var oe = Math.floor((this.audioContext.currentTime * sampleRate) / 2048) * 2048;
			var ea = oe / sampleRate;
			for (let i = 0; i < this.playingAudios.length; i++) {
				const playingAudio = this.playingAudios[i];
				if (playingAudio.ended) break;
				var buf = playingAudio.buffer;
				var _l = buf.getChannelData(0);
				var _r = buf.numberOfChannels == 2 ? buf.getChannelData(0) : _l;
				var hs = this.getAudioNodeVolume(playingAudio);
				for (let i2 = 0; i2 < 2048; i2++) {
					var st = ((playingAudio.timeFrame || 0) + ea - playingAudio.startTime) * buf.sampleRate;
					var _i = (st + i2 * (buf.sampleRate / sampleRate)) | 0;
					bufferLeft[i2] += (_l[_i] || 0) * hs[0];
					bufferRight[i2] += (_r[_i] || 0) * hs[1];
				}
			}
			return oe;
		}
		_createPan(input) {
			var inputNode = this.audioContext.createGain();
			var leftGain = this.audioContext.createGain();
			var rightGain = this.audioContext.createGain();
			var channelMerger = this.audioContext.createChannelMerger(2);
			inputNode.connect(leftGain);
			inputNode.connect(rightGain);
			leftGain.connect(channelMerger, 0, 0);
			rightGain.connect(channelMerger, 0, 1);
			channelMerger.connect(input);
			return { inputNode, leftGain, rightGain, outputNode: channelMerger };
		}
		tick() {
			for (let i = 0; i < this.playingAudios.length; i++) {
				const playingAudio = this.playingAudios[i];
				if (playingAudio.type == "start_sound") {
					this.tickPlayingAudio(playingAudio);
				} else if (playingAudio.type == "stream_sound") {
					this.tickPlayingSoundStream(playingAudio);
				}
			}
			var newList = [];
			for (let i = 0; i < this.playingAudios.length; i++) {
				const playingAudio = this.playingAudios[i];
				if (!playingAudio.ended) newList.push(playingAudio);
			}
			this.playingAudios = newList;
		}
		tickPlayingAudio(playingAudio) {
			if (playingAudio.ended) return;
			var SGFtime = this.audioContext.currentTime - playingAudio.startTime;
			var SGFtime2 = this.audioContext.currentTime - playingAudio.startTimeOriginal;
			var envelopes = playingAudio.envelopes;
			if (envelopes) {
				var nodeLR = playingAudio.nodeLR;
				if (playingAudio.envelopeId < envelopes.length) {
					var rs = envelopes[playingAudio.envelopeId];
					var rs2 = envelopes[playingAudio.envelopeId - 1];
					if (rs2) {
						const per = Math.max(Math.min((SGFtime2 * 44100 - rs2.sample) / (rs.sample - rs2.sample), 1), 0);
						const startPer = 1 - per;
						const leftVal = (rs2.leftVolume * startPer + rs.leftVolume * per) / 32768;
						const rightVal = (rs2.rightVolume * startPer + rs.rightVolume * per) / 32768;
						nodeLR.rightGain.gain.value = Math.max(Math.min(rightVal, 1), 0);
						nodeLR.leftGain.gain.value = Math.max(Math.min(leftVal, 1), 0);
					}
					if (SGFtime2 >= rs.sample / 44100) {
						const leftVal = rs.leftVolume / 32768;
						const rightVal = rs.rightVolume / 32768;
						nodeLR.rightGain.gain.value = Math.max(Math.min(rightVal, 1), 0);
						nodeLR.leftGain.gain.value = Math.max(Math.min(leftVal, 1), 0);
						playingAudio.envelopeId++;
					}
				}
			}
			if (SGFtime + playingAudio.soundStart > playingAudio.soundEnd) {
				playingAudio.loopCount--;
				if (playingAudio.loopCount) {
					playingAudio.startTime = this.audioContext.currentTime;
					this.playSound(playingAudio);
				} else {
					this.stopSound(playingAudio);
				}
			}
		}
		tickPlayingSoundStream(playingaudio) {
			if (!playingaudio.ended) {
				if (this.streamSoundIsEnded(playingaudio)) {
					this.stopStreamSound(playingaudio);
				}
			}
		}
		getAudioNodeVolume(n) {
			var l = 0;
			var r = 0;
			var nodeLR = n.nodeLR;
			if (nodeLR) {
				l = nodeLR.rightGain.gain.value;
				r = nodeLR.leftGain.gain.value;
			} else {
				l = 1;
				r = 1;
			}
			return [l, r];
		}
		streamSoundIsEnded(a) {
			return (a.timeFrame + (this.audioContext.currentTime - a.startTime) >= a.duration);
		}
		cleanup() {
			this.stopAllSounds(true);
		}
		setFrameRate(frameRate) {
			this.frameRate = frameRate;
		}
		stopAllSounds(stop) {
			for (let i = 0; i < this.playingAudios.length; i++) {
				const playingAudio = this.playingAudios[i];
				this.stopSound(playingAudio);
			}
		}
		isSoundPlaying(soundplaying) {
			return !soundplaying.ended;
		}
		isSoundPlayingWithHandle(handle) {
			for (let i = 0; i < this.playingAudios.length; i++) {
				const playingAudio = this.playingAudios[i];
				if (playingAudio.type == "start_sound") {
					if (handle === playingAudio.sound) return !playingAudio.ended;
				}
			}
			return false;
		}
		stopSoundsWithHandle(handle) {
			for (let i = 0; i < this.playingAudios.length; i++) {
				const playingAudio = this.playingAudios[i];
				if (playingAudio.type == "start_sound") {
					if (handle === playingAudio.sound) this.stopSound(playingAudio);
				}
			}
		}
		stopSound(soundPlaying) {
			if (soundPlaying.source) soundPlaying.source.disconnect();
			soundPlaying.source = null;
			soundPlaying.ended = true;
		}
		playSound(soundPlaying) {
			if (soundPlaying.source) soundPlaying.source.disconnect();
			var source = this.audioContext.createBufferSource();
			source.buffer = soundPlaying.buffer;
			if (soundPlaying.nodeLR) source.connect(soundPlaying.nodeLR.inputNode);
			else source.connect(this.node);
			var s = soundPlaying.soundStart + (this.audioContext.currentTime - soundPlaying.startTime);
			source.start(this.audioContext.currentTime, s);
			soundPlaying.source = source;
		}
		startSound(sound, soundInfo, mc) {
			var sp = {};
			sp.sound = sound;
			sp.type = "start_sound";
			sp.ended = false;
			sp.startTime = this.audioContext.currentTime;
			sp.startTimeOriginal = this.audioContext.currentTime;
			sp.buffer = sound.getBuffer();
			sp.soundStart = 0;
			sp.soundEnd = sp.buffer.duration;
			sp.loopCount = 1;
			if ("numLoops" in soundInfo) sp.loopCount = soundInfo.numLoops;
			if ("inSample" in soundInfo) sp.soundStart = soundInfo.inSample / 44100;
			if ("outSample" in soundInfo) sp.soundEnd = soundInfo.outSample / 44100;
			if ("envelope" in soundInfo) {
				sp.nodeLR = this._createPan(this.node);
				sp.envelopeId = 0;
				var envelopes = soundInfo.envelope;
				var rs = envelopes[0];
				if (rs) {
					const leftVal = rs.leftVolume / 32768;
					const rightVal = rs.rightVolume / 32768;
					sp.nodeLR.rightGain.gain.value = Math.max(Math.min(rightVal, 1), 0);
					sp.nodeLR.leftGain.gain.value = Math.max(Math.min(leftVal, 1), 0);
				}
				sp.envelopes = envelopes;
			} else {
				sp.nodeLR = null;
			}
			this.playSound(sp);
			this.playingAudios.push(sp);
		}
		startStream(audioStreamHandle, clip, clipFrame, block, streamInfo) {
			var result = audioStreamHandle.getBlock(block);
			if (!result) return;
			var rate = +(1000 / this.frameRate).toFixed(1);
			var durations = result.buffer.duration;
			var timeFrame = (result.timeFrame * rate) / 1000;
			var audioStream = clip.audioStream;
			if (audioStream) {
				if (!audioStream.ended) {
					var isS = (Math.abs((this.audioContext.currentTime - audioStream.startTime) - (timeFrame - audioStream.timeFrame)) > 0.15);
					if ((audioStream.blocks !== result.blocks) || isS) {
						audioStream.blocksInfo = result;
						audioStream.blocks = result.blocks;
						audioStream.buffer = result.buffer;
						audioStream.timeFrame = timeFrame;
						audioStream.duration = durations;
						audioStream.startTime = this.audioContext.currentTime;
						this.playStreamSound(audioStream);
					}
				}
				return audioStream;
			}
			var sp = {};
			sp.sound = audioStreamHandle;
			sp.type = "stream_sound";
			sp.ended = false;
			sp.blocksInfo = result;
			sp.blocks = result.blocks;
			sp.buffer = result.buffer;
			sp.timeFrame = timeFrame;
			sp.startClipFrame = clipFrame;
			sp.duration = durations;
			sp.startTime = this.audioContext.currentTime;
			this.playStreamSound(sp);
			this.playingAudios.push(sp);
			return sp;
		}
		playStreamSound(soundPlaying) {
			if (soundPlaying.source) soundPlaying.source.disconnect();
			var source = this.audioContext.createBufferSource();
			source.buffer = soundPlaying.buffer;
			source.connect(this.node);
			var timeFrame = soundPlaying.timeFrame;
			var s = timeFrame + (this.audioContext.currentTime - soundPlaying.startTime);
			source.start(this.audioContext.currentTime, s);
			soundPlaying.source = source;
		}
		stopStreamSound(sound) {
			if (sound.source) sound.source.disconnect();
			sound.source = null;
			sound.ended = true;
		}
		getVolume() {
			return this.node.gain.value;
		}
		setVolume(value) {
			this.node.gain.value = value;
		}
		registerSound(sound) {
			this.compressSoundMap[sound.format.compression] = true;
			var buffer = loadDefineSound(this.audioContext, sound);
			return new Sound(buffer, sound.format);
		}
		loadStreamSound(streamInfo, tags) {
			if (streamInfo.stream.compression != "uncompressedUnknownEndian")
				this.compressSoundMap[streamInfo.stream.compression] = true;
			var buffer = loadStreamSoundTimeline(this.audioContext, tags, streamInfo);
			return new SoundStream(buffer, streamInfo);
		}
	}
	class Bitmap {
		constructor(width, height, format, data) {
			this.width = width;
			this.height = height;
			this.format = format;
			this.data = data;
		}
		toRGBA() {
			switch (this.format) {
				case "yuv420p":
					var luma_len = (this.width * this.height);
					var chroma_len = (this.chroma_width() * this.chroma_height());
					var y = this.data.subarray(0, luma_len);
					var u = this.data.subarray(luma_len, luma_len + chroma_len);
					var v = this.data.subarray(luma_len + chroma_len, luma_len + 2 * chroma_len);
					this.data = yuv420_to_rgba(y, u, v, this.width);
					break;
				case "yuva420p":
					var luma_len = (this.width * this.height);
					var chroma_len = (this.chroma_width() * this.chroma_height());
					var y = this.data.subarray(0, luma_len);
					var u = this.data.subarray(luma_len, luma_len + chroma_len);
					var v = this.data.subarray(luma_len + chroma_len, luma_len + 2 * chroma_len);
					let a = this.data.subarray(luma_len + 2 * chroma_len, 2 * luma_len + 2 * chroma_len);
					this.data = yuv420_to_rgba(y, u, v, this.width);
					for (let i = 0; i < this.data.length; i += 4) 
						this.data[i + 3] = a[(i / 4) | 0];
					break;
			}
			this.format = "rgba";
		}
		chroma_width() {
			return ((this.width + 1) / 2) | 0;
		}
		chroma_height() {
			return ((this.height + 1) / 2) | 0;
		}
	}
	class TransformStack {
		constructor() {
			this.stackMt = [[1, 0, 0, 1, 0, 0]];
			this.stackCT = [[1, 1, 1, 1, 0, 0, 0, 0]];
			this.pushTotal = 1;
		}
		stackPush(matrix, colorTransform) {
			this.stackMt.push(multiplicationMatrix(this.getMatrix(), matrix));
			this.stackCT.push(multiplicationColor(this.getColorTransform(), colorTransform));
			if (this.stackCT.length > this.pushTotal) 
				this.pushTotal = this.stackCT.length;
		}
		stackPop() {
			this.stackMt.pop();
			this.stackCT.pop();
		}
		getMatrix() {
			return this.stackMt[this.stackMt.length - 1];
		}
		getColorTransform() {
			return this.stackCT[this.stackCT.length - 1];
		}
		setMatrix(matrix) {
			this.stackMt = [matrix];
		}
		setColorTransform(colorTransform) {
			this.stackCT = [colorTransform];
		}
	}
	class CommandList {
		constructor() {
			this.commandLists = [];
			this.maskersInProgress = 0;
		}
		execute(renderer) {
			for (let i = 0; i < this.commandLists.length; i++) {
				const tsd = this.commandLists[i];
				switch (tsd[0]) {
					case "render_shape":
						renderer.renderShape(tsd[1], tsd[2], tsd[3]);
						break;
					case "render_bitmap":
						renderer.renderBitmap(tsd[1], tsd[2], tsd[3], tsd[4]);
						break;
					case "push_mask":
						renderer.pushMask();
						break;
					case "pop_mask":
						renderer.popMask();
						break;
					case "activate_mask":
						renderer.activateMask();
						break;
					case "deactivate_mask":
						renderer.deactivateMask();
						break;
					case "blend":
						renderer.blend(tsd[1], tsd[2]);
						break;
				}
			}
		}
		drawingMask() {
			return this.maskersInProgress > 0;
		}
		clear() {
			this.commandLists = [];
		}
		copy() {
			var clone = new CommandList();
			clone.commandLists = this.commandLists.slice(0);
			return clone;
		}
		replace(commands) {
			this.commandLists = commands.commandLists.slice(0);
		}
		renderShape(shape, transfrom, colorT) {
			if (this.maskersInProgress <= 1)
				this.commandLists.push([
					"render_shape",
					shape,
					transfrom.slice(0),
					colorT.slice(0),
				]);
		}
		renderBitmap(bitmap, transfrom, colorT, isSmoothed) {
			if (this.maskersInProgress <= 1)
				this.commandLists.push(["render_bitmap", bitmap, transfrom.slice(0), colorT.slice(0), isSmoothed]);
		}
		pushMask() {
			if (this.maskersInProgress == 0) this.commandLists.push(["push_mask"]);
			this.maskersInProgress += 1;
		}
		activateMask() {
			this.maskersInProgress -= 1;
			if (this.maskersInProgress == 0) this.commandLists.push(["activate_mask"]);
		}
		deactivateMask() {
			if (this.maskersInProgress == 0)
				this.commandLists.push(["deactivate_mask"]);
			this.maskersInProgress += 1;
		}
		popMask() {
			this.maskersInProgress -= 1;
			if (this.maskersInProgress == 0) this.commandLists.push(["pop_mask"]);
		}
		blend(commands, blendMode) {
			this.commandLists.push(["blend", commands, blendMode]);
		}
	}
	function linearGradientXY(m) {
		var x0 = -16384 * m[0] - 16384 * m[2] + m[4];
		var x1 = 16384 * m[0] - 16384 * m[2] + m[4];
		var x2 = -16384 * m[0] + 16384 * m[2] + m[4];
		var y0 = -16384 * m[1] - 16384 * m[3] + m[5];
		var y1 = 16384 * m[1] - 16384 * m[3] + m[5];
		var y2 = -16384 * m[1] + 16384 * m[3] + m[5];
		var vx2 = x2 - x0;
		var vy2 = y2 - y0;
		var r1 = Math.sqrt(vx2 * vx2 + vy2 * vy2);
		vx2 /= r1;
		vy2 /= r1;
		var r2 = (x1 - x0) * vx2 + (y1 - y0) * vy2;
		return [x0 + r2 * vx2, y0 + r2 * vy2, x1, y1];
	}
	function checkImageColorTransform(colorTransform) {
		return (colorTransform[0] !== 1 || colorTransform[1] !== 1 || colorTransform[2] !== 1 || colorTransform[4] || colorTransform[5] || colorTransform[6]);
	}
	function sameBlendMode(first, second) {
		return first == second;
	}
	class RenderCanvas2dTexture {
		constructor(renderer) {
			this.renderer = renderer;
			this.width = 0;
			this.height = 0;
			this.texture = null;
			this.isDrawing = false;
			this.isColorTransformCache = false;
			this.c = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
			this.ctx = null;
		}
		_initColorTransformCache() {
			this.tmpCanvas = document.createElement("canvas");
			this.tmpCtx = this.tmpCanvas.getContext("2d");
			this.isColorTransformCache = true;
		}
		getTexture(color) {
			if (color && checkImageColorTransform(color)) {
				if (!this.isColorTransformCache) this._initColorTransformCache();
				if (this.c[0] != color[0] || this.c[1] != color[1] || this.c[2] != color[2] || this.c[3] != color[3] || this.c[4] != color[4] || this.c[5] != color[5] || this.c[6] != color[6] || this.c[7] != color[7]) {
					var width = this.texture.width;
					var height = this.texture.height;
					this.tmpCanvas.width = width;
					this.tmpCanvas.height = height;
					this.tmpCtx.drawImage(this.texture, 0, 0);
					var imgData = this.tmpCtx.getImageData(0, 0, width, height);
					var pxData = imgData.data;
					var idx = 0;
					var RedMultiTerm = color[0];
					var GreenMultiTerm = color[1];
					var BlueMultiTerm = color[2];
					var AlphaMultiTerm = color[3];
					var RedAddTerm = color[4];
					var GreenAddTerm = color[5];
					var BlueAddTerm = color[6];
					var AlphaAddTerm = color[7];
					var length = width * height;
					if (length > 0) {
						while (length--) {
							var R = pxData[idx++];
							var G = pxData[idx++];
							var B = pxData[idx++];
							var A = pxData[idx++];
							pxData[idx - 4] = Math.max(0, Math.min(R * RedMultiTerm + RedAddTerm, 255)) | 0;
							pxData[idx - 3] = Math.max(0, Math.min(G * GreenMultiTerm + GreenAddTerm, 255)) | 0;
							pxData[idx - 2] = Math.max(0, Math.min(B * BlueMultiTerm + BlueAddTerm, 255)) | 0;
							pxData[idx - 1] = Math.max(0, Math.min(A * AlphaMultiTerm + AlphaAddTerm, 255));
						}
					}
					this.tmpCtx.putImageData(imgData, 0, 0);
					this.c[0] = color[0];
					this.c[1] = color[1];
					this.c[2] = color[2];
					this.c[3] = color[3];
					this.c[4] = color[4];
					this.c[5] = color[5];
					this.c[6] = color[6];
					this.c[7] = color[7];
				}
				return this.tmpCanvas;
			} else {
				return this.texture;
			}
		}
		setImage(image) {
			if (!image) return;
			image.toRGBA();
			if (this.texture) {
				this.texture.width = image.width;
				this.texture.height = image.height;
			} else {
				var canvas = document.createElement("canvas");
				this.ctx = canvas.getContext("2d");
				canvas.width = image.width;
				canvas.height = image.height;
				this.texture = canvas;
			}
			this.width = image.width;
			this.height = image.height;
			var r = new ImageData(image.width, image.height);
			r.data.set(image.data, 0);
			this.ctx.putImageData(r, 0, 0);
			this.isDrawing = true;
			this.c = [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
			this.isColorTransformCache = false;
		}
	}
	class RenderCanvas2dShapeInterval {
		constructor(renderer, shapeIntervalData) {
			this.renderer = renderer;
			this.shapeIntervalData = shapeIntervalData;
		}
	}
	class RenderCanvas2d {
		constructor() {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
			this.quality = "high";
			this.width = 640;
			this.height = 480;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.matrixTransform = [1, 0, 0, 1, 0, 0];
			this.colorTransform = [1, 1, 1, 1, 0, 0, 0, 0];
			this.maskState = 0;
			this.blendModes = ["normal"];
			this.tmpCanvas = document.createElement("canvas");
			this.tmpCtx = this.tmpCanvas.getContext("2d");
		}
		setQuality(quality) {
			this.quality = quality;
		}
		submitFrame(clear, commands) {
			this.beginFrame(clear);
			commands.execute(this);
		}
		applyBlendMode(blendMode) {
			var mode = 'source-over';
			switch (blendMode) {
				case "multiply":
					mode = 'multiply';
					break;
				case "screen":
					mode = 'screen';
					break;
				case "lighten":
					mode = 'lighten';
					break;
				case "darken":
					mode = 'darken';
					break;
				case "difference":
				case "subtract":
					mode = 'difference';
					break;
				case "add":
					mode = 'lighter';
					break;
				case "overlay":
					mode = 'overlay';
					break;
				case "hardlight":
					mode = 'hard-light';
					break;
			}
			this.ctx.globalCompositeOperation = mode;
		}
		beginFrame(clear) {
			this.setTransform(1, 0, 0, 1, 0, 0);
			this.setColorTransform(1, 1, 1, 1, 0, 0, 0, 0);
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			var css = "rgba(" + clear.join(",") + ")";
			this.ctx.fillStyle = css;
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		}
		destroy() { }
		resize(w, h) {
			this.width = w;
			this.height = h;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
		}
		createImageInterval() {
			return new RenderCanvas2dTexture(this);
		}
		isAllowImageColorTransform() {
			return this.quality == "high";
		}
		setColorTransform(a, b, c, d, e, f, x, y) {
			this.colorTransform = [a, b, c, d, e, f, x, y];
		}
		setTransform(a, b, c, d, e, f) {
			this.matrixTransform = [a, b, c, d, e, f];
		}
		buildCmd2dPath(cmd) {
			var str = "";
			for (let i = 0; i < cmd.length; i++) {
				const a = cmd[i];
				switch (a[0]) {
					case 0:
						str += "ctx.moveTo(" + a[1] + "," + a[2] + ");\n";
						break;
					case 1:
						str += "ctx.quadraticCurveTo(" + a[1] + "," + a[2] + "," + a[3] + "," + a[4] + ");\n";
						break;
					case 2:
						str += "ctx.lineTo(" + a[1] + "," + a[2] + ");\n";
						break;
				}
			}
			return new Function("ctx", str);
		}
		shapeToInterval(shapeCache, library) {
			// 0 fill
			// 1 stroke
			// 0 color
			// 1 gradient
			// 2 bitmap
			var result = [];
			for (let i = 0; i < shapeCache.length; i++) {
				result.push(this.shapeToCanvas(shapeCache[i], library));
			}
			return new RenderCanvas2dShapeInterval(this, result);
		}
		shapeToCanvas(shape, library) {
			var isStroke = shape.type == 1;
			var width = shape.width || 0;
			var fillInfo = shape.fill;
			if (!fillInfo) return;
			var cmdResult = this.buildCmd2dPath(shape.path2d);
			if (fillInfo.type == 0) {
				return {
					type: 0,
					cmd: cmdResult,
					color: fillInfo.color.slice(0),
					isStroke,
					width,
				};
			} else if (fillInfo.type == 1) {
				return {
					type: 1,
					cmd: cmdResult,
					isRadial: fillInfo.isRadial,
					focal: fillInfo.focal,
					matrix: fillInfo.matrix.slice(0),
					records: JSON.parse(JSON.stringify(fillInfo.records)),
					isStroke,
					width,
				};
			} else if (fillInfo.type == 2) {
				var id = fillInfo.id;
				var bitmapi = library.characterById(id).bitmapH();
				return {
					type: 2,
					cmd: cmdResult,
					matrix: fillInfo.matrix.slice(0),
					texture: bitmapi,
					isSmoothed: fillInfo.isSmoothed,
					isRepeating: fillInfo.isRepeating,
					isStroke,
					width,
				};
			}
		}
		registerShape(shapes, library) {
			return this.shapeToInterval(shapes, library);
		}
		pushMask() {
			if (this.maskState == 0) {
				this.ctx.beginPath();
				this.ctx.save();
				this.maskState = 1;
			}
		}
		activateMask() {
			this.ctx.clip();
			this.maskState = 0;
		}
		deactivateMask() {
			if (this.maskState == 0) {
				this.maskState = 2;
			}
		}
		popMask() {
			if (this.maskState == 2) {
				this.ctx.restore();
				this.maskState = 0;
			}
		}
		pushBlendMode(blendMode) {
			if (!sameBlendMode(this.blendModes[this.blendModes.length - 1], blendMode)) this.applyBlendMode(blendMode);
			this.blendModes.push(blendMode);
		}
		popBlendMode() {
			let old = this.blendModes.pop();
			let current = this.blendModes[this.blendModes.length - 1] || "normal";
			if (!sameBlendMode(old, current)) this.applyBlendMode(current);
		}
		renderBitmap(texture, matrix, colorTransform, isSmoothed) {
			var isA = this.isAllowImageColorTransform();
			this.setTransform(...matrix);
			this.setColorTransform(...colorTransform);
			this.ctx.imageSmoothingEnabled = isSmoothed || false;
			if (texture && texture.isDrawing) {
				this.ctx.setTransform(...this.matrixTransform);
				if (!isA || !checkImageColorTransform(colorTransform))
					this.ctx.globalAlpha = Math.max(0, Math.min(255 * colorTransform[3] + colorTransform[7], 255)) / 255;
				this.ctx.drawImage(texture.getTexture(isA ? colorTransform : null), 0, 0);
				this.ctx.globalAlpha = 1;
			}
		}
		renderShape(shapeInterval, matrix, colorTransform) {
			var isA = this.isAllowImageColorTransform();
			this.setTransform(...matrix);
			this.setColorTransform(...colorTransform);
			if (!shapeInterval) return;
			var shapeIntervalData = shapeInterval.shapeIntervalData;
			for (let i = 0; i < shapeIntervalData.length; i++) {
				const si = shapeIntervalData[i];
				if (!si) return;
				var isStroke = si.isStroke;
				var cmd = si.cmd;
				var width = si.width || 0;
				if (this.maskState == 1) {
					this.ctx.setTransform(...this.matrixTransform);
					cmd(this.ctx);
				} else if (this.maskState == 2) {
					// Canvas backend doesn't have to do anything to clear masks.
				} else {
					if (si.type == 0) {
						var color = si.color;
						this.ctx.setTransform(...this.matrixTransform);
						this.ctx.beginPath();
						cmd(this.ctx);
						var css = "rgba(" + generateColorTransform(color, this.colorTransform).join(",") + ")";
						if (isStroke) {
							this.ctx.lineWidth = width;
							this.ctx.lineCap = "round";
							this.ctx.lineJoin = "round";
							this.ctx.strokeStyle = css;
							this.ctx.stroke();
						} else {
							this.ctx.fillStyle = css;
							this.ctx.fill();
						}
					} else if (si.type == 1) {
						var isRadial = si.isRadial;
						this.ctx.setTransform(...this.matrixTransform);
						this.ctx.beginPath();
						cmd(this.ctx);
						var css;
						if (isRadial) {
							css = this.ctx.createRadialGradient(16384 * Math.min(Math.max(si.focal, -0.98), 0.98), 0, 0, 0, 0, 16384);
						} else {
							var xy = linearGradientXY(si.matrix);
							css = this.ctx.createLinearGradient(xy[0] || 0, xy[1] || 0, xy[2] || 0, xy[3] || 0);
						}
						for (let j = 0; j < si.records.length; j++) {
							const rc = si.records[j];
							css.addColorStop(rc[1], "rgba(" + generateColorTransform(rc[0], this.colorTransform).join(",") + ")");
						}
						if (isRadial) {
							this.ctx.save();
							this.ctx.transform(...si.matrix);
						}
						if (isStroke) {
							this.ctx.lineWidth = width;
							this.ctx.lineCap = "round";
							this.ctx.lineJoin = "round";
							this.ctx.strokeStyle = css;
							this.ctx.stroke();
						} else {
							this.ctx.fillStyle = css;
							this.ctx.fill();
						}
						if (isRadial) {
							this.ctx.restore();
						}
					} else if (si.type == 2) {
						var bMatrix = si.matrix;
						var repeat = si.isRepeating ? "repeat" : "no-repeat";
						var texture = si.texture;
						if (texture && texture.isDrawing) {
							this.ctx.setTransform(...this.matrixTransform);
							this.ctx.beginPath();
							cmd(this.ctx);
							this.ctx.save();
							this.ctx.transform(...bMatrix);
							this.ctx.imageSmoothingEnabled = si.isSmoothed || false;
							var image = texture.getTexture(isA ? colorTransform : null);
							if (!isA || !checkImageColorTransform(colorTransform))
								this.ctx.globalAlpha = Math.max(0, Math.min(255 * colorTransform[3] + colorTransform[7], 255)) / 255;
							var p = this.ctx.createPattern(image, repeat);
							this.ctx.fillStyle = p;
							this.ctx.fill();
							this.ctx.globalAlpha = 1;
							this.ctx.restore();
						}
					}
				}
			}
		}
		blend(commands, blendMode) {
			this.pushBlendMode(blendMode);
			commands.execute(this);
			this.popBlendMode();
		}
	}
	function QuadraticBezierP0( t, p ) {
		const k = 1 - t;
		return k * k * p;
	}
	function QuadraticBezierP1( t, p ) {
		return 2 * (1 - t) * t * p;
	}
	function QuadraticBezierP2( t, p ) {
		return t * t * p;
	}
	function QuadraticBezier(t, p0, p1, p2) {
		return QuadraticBezierP0(t, p0) + QuadraticBezierP1(t, p1) + QuadraticBezierP2(t, p2);
	}
	function swf_to_gl_matrix(m) {
		let tx = m[4];
		let ty = m[5];
		let det = m[0] * m[3] - m[2] * m[1];
		let a = m[3] / det;
		let b = -m[2] / det;
		let c = -(tx * m[3] - m[2] * ty) / det;
		let d = -m[1] / det;
		let e = m[0] / det;
		let f = (tx * m[1] - m[0] * ty) / det;
		a *= 1 / 32768.0;
		b *= 1 / 32768.0;
		d *= 1 / 32768.0;
		e *= 1 / 32768.0;
		c /= 32768.0;
		f /= 32768.0;
		c += 0.5;
		f += 0.5;
		return [a, d, 0.0, b, e, 0.0, c, f, 1.0];
	}
	function swf_bitmap_to_gl_matrix(m, bitmap_width, bitmap_height) {
		let tx = m[4];
		let ty = m[5];
		let det = m[0] * m[3] - m[2] * m[1];
		let a = m[3] / det;
		let b = -m[2] / det;
		let c = -(tx * m[3] - m[2] * ty) / det;
		let d = -m[1] / det;
		let e = m[0] / det;
		let f = (tx * m[1] - m[0] * ty) / det;
		a *= 1 / bitmap_width;
		b *= 1 / bitmap_width;
		d *= 1 / bitmap_height;
		e *= 1 / bitmap_height;
		c /= bitmap_width;
		f /= bitmap_height;
		return [a, d, 0.0, b, e, 0.0, c, f, 1.0];
	}
	class Shader {
		constructor(gl, program) {
			this.gl = gl;
			this.program = program;
			this.uniformLocations = {};
			this.attributeLocations = {};
			const activeUniforms = gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
			for (let index = 0; index < activeUniforms; index++) {
				const info = gl.getActiveUniform(program, index);
				if (!info) {
					throw new Error('uniform at index ' + index + ' does not exist');
				}
				const name = info.name;
				const location = gl.getUniformLocation(program, name);
				if (!location) {
					throw new Error('uniform named ' + name + ' does not exist');
				}
				this.uniformLocations[name] = location;
			}
			const activeAttributes = gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
			for (let index = 0; index < activeAttributes; index++) {
				const info = gl.getActiveAttrib(program, index);
				if (!info) {
					throw new Error('attribute at index ' + index + ' does not exist');
				}
				this.attributeLocations[info.name] = gl.getAttribLocation(program, info.name);
			}
		}
		uniform1f(name, value) {
			const location = this.getUniform(name);
			this.gl.uniform1f(location, value);
		}
		uniform1i(name, value) {
			const location = this.getUniform(name);
			this.gl.uniform1i(location, value);
		}
		uniform1fv(name, value) {
			const location = this.getUniform(name);
			this.gl.uniform1fv(location, value);
		}
		uniform4fv(name, value) {
			const location = this.getUniform(name);
			this.gl.uniform4fv(location, value);
		}
		uniform2f(name, a, b) {
			const location = this.getUniform(name);
			this.gl.uniform2f(location, a, b);
		}
		uniform3f(name, a, b, c) {
			const location = this.getUniform(name);
			this.gl.uniform3f(location, a, b, c);
		}
		uniform4f(name, a, b, c, d) {
			const location = this.getUniform(name);
			this.gl.uniform4f(location, a, b, c, d);
		}
		uniformMatrix3(name, value) {
			const location = this.getUniform(name);
			this.gl.uniformMatrix3fv(location, false, value);
		}
		uniformMatrix4(name, value) {
			const location = this.getUniform(name);
			this.gl.uniformMatrix4fv(location, false, value);
		}
		hasUniform(name) {
			return this.uniformLocations.hasOwnProperty(name);
		}
		getUniform(name) {
			if (!this.hasUniform(name)) {
				throw new Error('uniform of name ' + name + ' does not exist');
			}
			return this.uniformLocations[name];
		}
		attributeBuffer(name, value, count) {
			if (!this.hasAttribute(name)) {
				throw new Error('attribute of name ' + name + ' does not exist');
			}
			const location = this.attributeLocations[name];
			this.gl.enableVertexAttribArray(location);
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value);
			this.gl.vertexAttribPointer(location, count, this.gl.FLOAT, false, 0, 0);
		}
		hasAttribute(name) {
			return this.attributeLocations.hasOwnProperty(name);
		}
		getAttribute(name) {
			if (!this.hasAttribute(name)) {
				throw new Error('attribute of name ' + name + ' does not exist');
			}
			return this.attributeLocations[name];
		}
	}
	class RenderWebGLShapeInterval {
		constructor(renderer, interval) {
			this.renderer = renderer;
			this.shapeIntervalData = interval;
		}
	}
	class RenderWebGLImageInterval {
		constructor(renderer) {
			this.renderer = renderer;
			const gl = this.renderer.gl;
			this.width = 0;
			this.height = 0;
			this.texture = gl.createTexture();
		}
		setImage(image) {
			this.width = image.width;
			this.height = image.height;
			image.toRGBA();
			const gl = this.renderer.gl;
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image.data);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		}
	}
	class RenderWebGL {
		constructor() {
			const canvas = document.createElement('canvas');
			canvas.width = 360;
			canvas.height = 360;
			let options = {
				stencil: true,
				alpha: true,
				antialias: false,
				depth: false,
				failIfMajorPerformanceCaveat: true,
				premultipliedAlpha: true
			}
			this.canvas = canvas;
			this.maskState = 0;
			this.numMasks = 0;
			this.maskStateDirty = true;
			this.blendState = 0;
			this.blendType = null;
			this.view_matrix = null;
			this.gl = canvas.getContext('webgl2', options);
			if (isMobileOrTablet()) {
				this.msaa_sample_count = 2;
			} else {
				this.msaa_sample_count = 4;
			}
			var max_samples = this.gl.getParameter(this.gl.MAX_SAMPLES);
			if (max_samples != null) {
				if (max_samples > 0 && max_samples < this.msaa_sample_count) {
					console.log("Device only supports", max_samples, "xMSAA");
					this.msaa_sample_count = max_samples;
				}
			}
			let driver_info = this.gl.getExtension("WEBGL_debug_renderer_info");
			console.log(this.gl.getParameter(driver_info.UNMASKED_RENDERER_WEBGL));
			this.shaderColor = this.createShader(RenderWebGL.vs_color, RenderWebGL.fs_color);
			this.shaderGradient = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_gradient);
			this.shaderTexture = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_bitmap);
			this.shaderCopy = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_copy);
			this.initShaderBlend();
			this.gl.enable(this.gl.BLEND);
			this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
			this.quatBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.quatBuffer);
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]), this.gl.STATIC_DRAW);
			this.renderbuffer_width = 0;
			this.renderbuffer_height = 0;
			this.msaa_buffers = null;
			this.resize(480, 360);
		}
		initShaderBlend() {
			if ((this.msaa_sample_count <= 1)) {
				return;
			}
			this.shaderBlendNormal = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_normal);
			this.shaderBlendAdd = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_add);
			this.shaderBlendSubtract = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_subtract);
			this.shaderBlendMultiply = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_multiply);
			this.shaderBlendLighten = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_lighten);
			this.shaderBlendDarken = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_darken);
			this.shaderBlendScreen = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_screen);
			this.shaderBlendOverlay = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_overlay);
			this.shaderBlendHardlight = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_hardlight);
			this.shaderBlendDifference = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_difference);
			this.shaderBlendInvert = this.createShader(RenderWebGL.shader_texture, RenderWebGL.shader_blend_invert);
		}
		build_msaa_buffers() {
			const gl = this.gl;
			if (this.msaa_sample_count <= 1) {
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
				return;
			}
			if (this.msaa_buffers) {
				gl.deleteRenderbuffer(this.msaa_buffers.color_renderbuffer);
				gl.deleteRenderbuffer(this.msaa_buffers.stencil_renderbuffer);
				gl.deleteFramebuffer(this.msaa_buffers.render_framebuffer);
				gl.deleteFramebuffer(this.msaa_buffers.color_framebuffer);
				gl.deleteTexture(this.msaa_buffers.framebuffer_texture);
				gl.deleteFramebuffer(this.msaa_buffers.render_blend_front_framebuffer);
				gl.deleteFramebuffer(this.msaa_buffers.render_blend_back_framebuffer);
				gl.deleteTexture(this.msaa_buffers.blend_texture_front);
				gl.deleteTexture(this.msaa_buffers.blend_texture_back);
			}
			let render_framebuffer = gl.createFramebuffer();
			let color_framebuffer = gl.createFramebuffer();
			let color_renderbuffer = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, color_renderbuffer);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.msaa_sample_count, gl.RGBA8, this.renderbuffer_width, this.renderbuffer_height);
			let stencil_renderbuffer = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, stencil_renderbuffer);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, this.msaa_sample_count, gl.STENCIL_INDEX8, this.renderbuffer_width, this.renderbuffer_height);
			gl.bindFramebuffer(gl.FRAMEBUFFER, render_framebuffer);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,  gl.RENDERBUFFER, color_renderbuffer);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.STENCIL_ATTACHMENT,  gl.RENDERBUFFER, stencil_renderbuffer);
			let framebuffer_texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer_texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.renderbuffer_width, this.renderbuffer_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, color_framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer_texture, 0);
			let render_blend_front_framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, render_blend_front_framebuffer);
			gl.enable(gl.BLEND);
			gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
			gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			let blend_texture_front = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, blend_texture_front);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.renderbuffer_width, this.renderbuffer_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blend_texture_front, 0);
			let render_blend_back_framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, render_blend_back_framebuffer);
			gl.enable(gl.BLEND);
			gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
			gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			let blend_texture_back = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, blend_texture_back);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.renderbuffer_width, this.renderbuffer_height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, blend_texture_back, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			this.msaa_buffers = {
				color_renderbuffer,
				stencil_renderbuffer,
				render_framebuffer,
				color_framebuffer,
				framebuffer_texture,
				render_blend_front_framebuffer,
				blend_texture_front,
				render_blend_back_framebuffer,
				blend_texture_back
			};
		}
		createShader(vs, fs, definitions) {
			const program = this.compileProgram(vs, fs, definitions);
			return new Shader(this.gl, program);
		}
		compileProgram(vs, fs, definitions) {
			const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vs, definitions);
			const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fs, definitions);
			const program = this.gl.createProgram();
			if (!program) {
				throw new Error('Cannot create program');
			}
			this.gl.attachShader(program, vertexShader);
			this.gl.attachShader(program, fragmentShader);
			this.gl.linkProgram(program);
			if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
				const error = this.gl.getProgramInfoLog(program);
				this.gl.deleteProgram(program);
				throw new Error('Program compilation error: ' + error);
			}
			return program;
		}
		compileShader(type, source, definitions) {
			if (definitions) {
				for (const def of definitions) {
					source = '#define ' + def + '\n' + source;
				}
			}
			const shader = this.gl.createShader(type);
			if (!shader) {
				throw new Error('Cannot create shader');
			}
			this.gl.shaderSource(shader, source);
			this.gl.compileShader(shader);
			if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
				const error = this.gl.getShaderInfoLog(shader);
				this.gl.deleteShader(shader);
				throw new Error('Shader compilation error: ' + error);
			}
			return shader;
		}
		useShader(shader) {
			if (this.currentShader !== shader) {
				this.gl.useProgram(shader.program);
				this.currentShader = shader;
			}
		}
		shapeToInterval(shapeCache, library) {
			var result = [];
			for (let i = 0; i < shapeCache.length; i++) {
				result.push(this.shapeToCanvas(shapeCache[i], library));
			}
			return new RenderWebGLShapeInterval(this, result);
		}
		destroy() {
			var ext = this.gl.getExtension("WEBGL_lose_context");
			if (ext) ext.loseContext();
		}
		resize(w, h) {
			this.width = w;
			this.height = h;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.view_matrix = [1.0 / (w / 2.0), 0.0, 0.0, 0.0, 0.0, -1.0 / (h / 2.0), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0];
			this.renderbuffer_width = this.canvas.width;
			this.renderbuffer_height = this.canvas.height;
			this.build_msaa_buffers();
			this.gl.viewport(0, 0, this.renderbuffer_width, this.renderbuffer_height);
		}
		createImageInterval() {
			return new RenderWebGLImageInterval(this);
		}
		shapeToCanvas(shape, library) {
			const gl = this.gl;
			var fill = shape.fill;
			var vertices = (shape.type == 1) ? this.createStroke(shape.path2d, shape.width) : this.createFill(shape.path2d);
			var bufferPos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, bufferPos);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
			if (fill.type == 0) {
				var color = fill.color;
				return {
					type: 0,
					bufferPos: bufferPos,
					color: [color[0] / 255, color[1] / 255, color[2] / 255, color[3]],
					num: (vertices.length / 2),
				};
			} else if (fill.type == 1) {
				var ratios = [];
				var colors = [];
				var re = fill.records;
				for (let i = 0; i < 16; i++) {
					const g = re[Math.min(i, re.length - 1)];
					colors.push(g[0][0] / 255);
					colors.push(g[0][1] / 255);
					colors.push(g[0][2] / 255);
					colors.push(g[0][3]);
					ratios.push(g[1]);
				}
				return {
					type: 1,
					bufferPos: bufferPos,
					num: (vertices.length / 2),
					ratios,
					colors,
					focal: fill.focal || 0,
					isRadial: fill.isRadial,
					repeat: fill.repeat,
					matrix: swf_to_gl_matrix(fill.matrix)
				};
			} else if (fill.type == 2) {
				var bitmapi = library.characterById(fill.id).bitmapH();
				var texture = bitmapi.texture;
				return {
					type: 2,
					bufferPos: bufferPos,
					num: (vertices.length / 2),
					texture: texture,
					isRepeating: fill.isRepeating,
					isSmoothed: fill.isSmoothed,
					matrix: swf_bitmap_to_gl_matrix(fill.matrix, bitmapi.width, bitmapi.height)
				};
			}
		}
		getBlendShader(blendMode) {
			switch (blendMode) {
				case "add": return this.shaderBlendAdd;
				case "subtract": return this.shaderBlendSubtract;
				case "multiply": return this.shaderBlendMultiply;
				case "lighten": return this.shaderBlendLighten;
				case "darken": return this.shaderBlendDarken;
				case "screen": return this.shaderBlendScreen;
				case "overlay": return this.shaderBlendOverlay;
				case "hardlight": return this.shaderBlendHardlight;
				case "difference": return this.shaderBlendDifference;
				case "invert": return this.shaderBlendInvert;
				default: return null;
			}
		}
		pushBlendMode(blendMode) {
			if (!this.msaa_buffers) return;
			const gl = this.gl;
			if ((this.maskState == 0) && (this.blendState == 0)) {
				this.blendType = this.getBlendShader(blendMode);
				gl.disable(gl.STENCIL_TEST);
				gl.colorMask(true, true, true, true);
				gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
				gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.msaa_buffers.color_framebuffer);
				gl.blitFramebuffer(0, 0, this.renderbuffer_width, this.renderbuffer_height, 0, 0, this.renderbuffer_width, this.renderbuffer_height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_blend_front_framebuffer);
				this.useShader(this.shaderCopy);
				this.currentShader.uniformMatrix4("view_matrix", [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix4("world_matrix", [2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix3("u_matrix", [1, 0, 0, 0, 1, 0, 0, 0, 1]);
				this.currentShader.attributeBuffer("position", this.quatBuffer, 2);
				gl.bindTexture(gl.TEXTURE_2D, this.msaa_buffers.framebuffer_texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.drawArrays(gl.TRIANGLES, 0, 12);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
				gl.clearColor(0, 0, 0, 0);
				gl.stencilMask(0xff);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
			}
			this.blendState++;
		}
		popBlendMode() {
			if (!this.msaa_buffers) return;
			const gl = this.gl;
			this.blendState--;
			if (this.blendType && (this.blendState == 0)) {
				gl.disable(gl.STENCIL_TEST);
				gl.colorMask(true, true, true, true);
				gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
				gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.msaa_buffers.color_framebuffer);
				gl.blitFramebuffer(0, 0, this.renderbuffer_width, this.renderbuffer_height, 0, 0, this.renderbuffer_width, this.renderbuffer_height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_blend_back_framebuffer);
				this.useShader(this.shaderCopy);
				this.currentShader.uniformMatrix4("view_matrix", [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix4("world_matrix", [2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix3("u_matrix", [1, 0, 0, 0, 1, 0, 0, 0, 1]);
				this.currentShader.attributeBuffer("position", this.quatBuffer, 2);
				gl.bindTexture(gl.TEXTURE_2D, this.msaa_buffers.framebuffer_texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.drawArrays(gl.TRIANGLES, 0, 12);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
				gl.clearColor(0, 0, 0, 0);
				gl.stencilMask(0xff);
				gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
				this.useShader(this.blendType);
				this.currentShader.uniformMatrix4("view_matrix", [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix4("world_matrix", [2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix3("u_matrix", [1, 0, 0, 0, 1, 0, 0, 0, 1]);
				this.currentShader.uniform1i('parent_texture', 0);
				this.currentShader.uniform1i('current_texture', 1);
				this.currentShader.attributeBuffer("position", this.quatBuffer, 2);
				gl.bindTexture(gl.TEXTURE_2D, this.msaa_buffers.blend_texture_front);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.activeTexture(gl.TEXTURE1);
				gl.bindTexture(gl.TEXTURE_2D, this.msaa_buffers.blend_texture_back);
				gl.activeTexture(gl.TEXTURE1);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.activeTexture(gl.TEXTURE0);
				gl.drawArrays(gl.TRIANGLES, 0, 12);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_blend_front_framebuffer);
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_blend_back_framebuffer);
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
				this.blendType = null;
			}
		}
		blend(commands, blendMode) {
			this.pushBlendMode(blendMode);
			commands.execute(this);
			this.popBlendMode();
		}
		renderBitmap(imageInterval, matrix, colorTransform, isSmoothed) {
			if (!imageInterval) return;
			const gl = this.gl;
			this.setStencilState();
			matrix = multiplicationMatrix(matrix, [imageInterval.width, 0, 0, imageInterval.height, 0, 0])
			let world_matrix = [matrix[0], matrix[1], 0.0, 0.0, matrix[2], matrix[3], 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, matrix[4], matrix[5], 0.0, 1.0];
			this.useShader(this.shaderTexture);
			this.currentShader.uniformMatrix4("view_matrix", this.view_matrix);
			this.currentShader.uniformMatrix4("world_matrix", world_matrix);
			this.currentShader.uniformMatrix3("u_matrix", [1, 0, 0, 0, 1, 0, 0, 0, 1]);
			this.currentShader.uniform4f('mult_color', colorTransform[0], colorTransform[1], colorTransform[2], colorTransform[3]);
			this.currentShader.uniform4f('add_color', colorTransform[4] / 255, colorTransform[5] / 255, colorTransform[6] / 255, colorTransform[7] / 255);
			this.currentShader.attributeBuffer("position", this.quatBuffer, 2);
			let filter = isSmoothed ? gl.LINEAR : gl.NEAREST;
			gl.bindTexture(gl.TEXTURE_2D, imageInterval.texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
			let wrap = gl.CLAMP_TO_EDGE;
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
			gl.drawArrays(gl.TRIANGLES, 0, 12);
		}
		renderShape(shapeInterval, matrix, colorTransform) {
			if (!shapeInterval) return;
			const gl = this.gl;
			var array = shapeInterval.shapeIntervalData;
			this.setStencilState();
			let world_matrix = [matrix[0], matrix[1], 0.0, 0.0, matrix[2], matrix[3], 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, matrix[4], matrix[5], 0.0, 1.0];
			for (let i = 0; i < array.length; i++) {
				const si = array[i];
				var shader;
				if (si.type == 0) {
					shader = this.shaderColor;
				} else if (si.type == 1) {
					shader = this.shaderGradient;
				} else if (si.type == 2) {
					shader = this.shaderTexture;
				}
				this.useShader(shader);
				gl.bindBuffer(gl.ARRAY_BUFFER, si.bufferPos);
				shader.attributeBuffer("position", si.bufferPos, 2);
				if (si.type == 0) {
					shader.uniform4f('u_color', si.color[0], si.color[1], si.color[2], si.color[3]);
				} else if (si.type == 1) {
					shader.uniformMatrix3("u_matrix", si.matrix);
					shader.uniform1i("u_gradient_type", si.isRadial ? 2 : 0);
					shader.uniform1fv("u_ratios[0]", si.ratios);
					shader.uniform4fv("u_colors[0]", si.colors);
					shader.uniform1i("u_repeat_mode", si.repeat);
					shader.uniform1f("u_focal_point", si.focal);
					shader.uniform1i("u_interpolation", 0);
				} else if (si.type == 2) {
					let filter = si.isSmoothed ? gl.LINEAR : gl.NEAREST;
					gl.bindTexture(gl.TEXTURE_2D, si.texture);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
					let wrap = si.isRepeating ? gl.REPEAT : gl.CLAMP_TO_EDGE;
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
					shader.uniformMatrix3("u_matrix", si.matrix);
				}
				shader.uniformMatrix4("view_matrix", this.view_matrix);
				shader.uniformMatrix4("world_matrix", world_matrix);
				shader.uniform4f('mult_color', colorTransform[0], colorTransform[1], colorTransform[2], colorTransform[3]);
				shader.uniform4f('add_color', colorTransform[4] / 255, colorTransform[5] / 255, colorTransform[6] / 255, colorTransform[7] / 255);
				gl.drawArrays(gl.TRIANGLES, 0, si.num);
			}
		}
		registerShape(shapes, library) {
			return this.shapeToInterval(shapes, library);
		}
		path2dToVex(path2d) {
			var arrs = [];
			var arr = [];
			var posX = 0;
			var posY = 0;
			for (let i = 0; i < path2d.length; i++) {
				const a = path2d[i];
				switch (a[0]) {
					case 0:
						arr = [a[1], a[2]];
						arrs.push(arr);
						posX = a[1];
						posY = a[2];
						break;
					case 1:
						for (let _ = 1; _ <= 5; _++) {
							var x = QuadraticBezier(_ / 5, posX, a[1], a[3]) | 0;
							var y = QuadraticBezier(_ / 5, posY, a[2], a[4]) | 0;
							arr.push(x, y);
						}
						posX = a[3];
						posY = a[4];
						break;
					case 2:
						if (!((a[1] == posX) && (a[2] == posY))) {
							arr.push(a[1], a[2]);
							posX = a[1];
							posY = a[2];	
						}
						break;
				}
			}
			return arrs;
		}
		createFill(path2d) {
			return new Float32Array(AT_Tess.fill(this.path2dToVex(path2d)));
		}
		createStroke(path2d, width) {
			var arrs = this.path2dToVex(path2d);
			return new Float32Array(AT_Tess.stroke(arrs, width));
		}
		setStencilState() {
			const gl = this.gl;
			if (this.maskStateDirty) {
				switch(this.maskState) {
					case 0:
						gl.disable(gl.STENCIL_TEST);
						gl.colorMask(true, true, true, true);
						break;
					case 1:
						gl.enable(gl.STENCIL_TEST);
						gl.stencilFunc(gl.EQUAL, this.numMasks - 1, 0xff);
						gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
						gl.colorMask(false, false, false, false);
						break;
					case 2:
						gl.enable(gl.STENCIL_TEST);
						gl.stencilFunc(gl.EQUAL, this.numMasks, 0xff);
						gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
						gl.colorMask(true, true, true, true);
						break;
					case 3:
						gl.enable(gl.STENCIL_TEST);
						gl.stencilFunc(gl.EQUAL, this.numMasks, 0xff);
						gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
						gl.colorMask(false, false, false, false);
						break;
				}	
			}
		}
		pushMask() {
			this.numMasks += 1;
			this.maskState = 1;
			this.maskStateDirty = true;
		}
		activateMask() {
			this.maskState = 2;
			this.maskStateDirty = true;
		}
		deactivateMask() {
			this.maskState = 3;
			this.maskStateDirty = true;
		}
		popMask() {
			this.numMasks -= 1;
			if (this.numMasks == 0) {
				this.maskState = 0;
			} else {
				this.maskState = 2;
			}
			this.maskStateDirty = true;
		}
		setQuality(quality) {
			this.quality = quality;
		}
		submitFrame(clear, commands) {
			this.beginFrame(clear);
			commands.execute(this);
			this.endFrame();
		}
		beginFrame(clear) {
			this.blendState = 0;
			this.blendType = null;
			this.maskState = 0;
			this.numMasks = 0;
			this.maskStateDirty = true;
			const gl = this.gl;
			if (this.msaa_buffers) gl.bindFramebuffer(gl.FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
			gl.viewport(0, 0, this.canvas.width, this.canvas.height);
			this.setStencilState();
			gl.clearColor(clear[0] / 255, clear[1] / 255, clear[2] / 255, 1);
			gl.stencilMask(0xff);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
		}
		endFrame() {
			if (this.msaa_buffers) {
				const gl = this.gl;
				gl.disable(gl.STENCIL_TEST);
				gl.colorMask(true, true, true, true);
				gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.msaa_buffers.render_framebuffer);
				gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.msaa_buffers.color_framebuffer);
				gl.blitFramebuffer(0, 0, this.renderbuffer_width, this.renderbuffer_height, 0, 0, this.renderbuffer_width, this.renderbuffer_height, gl.COLOR_BUFFER_BIT, gl.NEAREST);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
				gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
				gl.clear(gl.COLOR_BUFFER_BIT);
				this.useShader(this.shaderCopy);
				this.currentShader.uniformMatrix4("view_matrix", [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix4("world_matrix", [2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0]);
				this.currentShader.uniformMatrix3("u_matrix", [1, 0, 0, 0, 1, 0, 0, 0, 1]);
				this.currentShader.attributeBuffer("position", this.quatBuffer, 2);
				gl.bindTexture(gl.TEXTURE_2D, this.msaa_buffers.framebuffer_texture);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.drawArrays(gl.TRIANGLES, 0, 12);	
			}
		}
	}
	RenderWebGL.shader_texture = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

attribute vec2 position;

varying vec2 frag_uv;

void main() {
	frag_uv = vec2(u_matrix * vec3(position, 1.0));
	gl_Position = view_matrix * world_matrix * vec4(position, 0.0, 1.0);
}`;
	RenderWebGL.shader_bitmap = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D u_texture;

varying vec2 frag_uv;

void main() {
	vec4 color = texture2D(u_texture, frag_uv);

	// Unmultiply alpha before apply color transform.
	if( color.a > 0.0 ) {
		color.rgb /= color.a;
		color = clamp(mult_color * color + add_color, 0.0, 1.0);
		float alpha = clamp(color.a, 0.0, 1.0);
		color = vec4(color.rgb * alpha, alpha);
	}

	gl_FragColor = color;
}`;
	RenderWebGL.shader_copy = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D u_texture;

varying vec2 frag_uv;

void main() {
	gl_FragColor = texture2D(u_texture, frag_uv);
}`;
	RenderWebGL.vs_color = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform vec4 u_color;

attribute vec2 position;

varying vec4 frag_color;

void main() {
	frag_color = clamp(u_color * mult_color + add_color, 0.0, 1.0);
	float alpha = clamp(frag_color.a, 0.0, 1.0);
	frag_color = vec4(frag_color.rgb * alpha, alpha);

	gl_Position =  view_matrix * world_matrix * vec4(position, 0.0, 1.0);
}`;
	RenderWebGL.fs_color = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;

varying vec4 frag_color;

void main() {
	gl_FragColor = frag_color;
}`;
	RenderWebGL.shader_gradient = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform int u_gradient_type;
uniform float u_ratios[16];
uniform vec4 u_colors[16];
uniform int u_repeat_mode;
uniform float u_focal_point;
uniform int u_interpolation;

varying vec2 frag_uv;

vec4 interpolate(float t, float ratio1, float ratio2, vec4 color1, vec4 color2) {
color1 = clamp(mult_color * color1 + add_color, 0.0, 1.0);
color2 = clamp(mult_color * color2 + add_color, 0.0, 1.0);
float a = (t - ratio1) / (ratio2 - ratio1);
return mix(color1, color2, a);
}

vec3 linear_to_srgb(vec3 linear) {
	vec3 a = 12.92 * linear;
	vec3 b = 1.055 * pow(linear, vec3(1.0 / 2.4)) - 0.055;
	vec3 c = step(vec3(0.0031308), linear);
	return mix(a, b, c);
}

void main() {
	float t;
	if( u_gradient_type == 0 )
	{
		t = frag_uv.x;
	}
	else if( u_gradient_type == 1 )
	{
		t = length(frag_uv * 2.0 - 1.0);
	}
	else if( u_gradient_type == 2 )
	{
		vec2 uv = frag_uv * 2.0 - 1.0;
		vec2 d = vec2(u_focal_point, 0.0) - uv;
		float l = length(d);
		d /= l;
		t = l / (sqrt(1.0 -  u_focal_point*u_focal_point*d.y*d.y) + u_focal_point*d.x);
	}
	if( u_repeat_mode == 0 )
	{
		// Clamp
		t = clamp(t, 0.0, 1.0);
	}
	else if( u_repeat_mode == 1 )
	{
		// Repeat
		t = fract(t);
	}
	else
	{
		// Mirror
		if( t < 0.0 )
		{
			t = -t;
		}

		if( int(mod(t, 2.0)) == 0 ) {
			t = fract(t);
		} else {
			t = 1.0 - fract(t);
		}
	}

	// TODO: No non-constant array access in WebGL 1, so the following is kind of painful.
	// We'd probably be better off passing in the gradient as a texture and sampling from there.
	vec4 color;
	if( t <= u_ratios[0] ) {
		color = clamp(mult_color * u_colors[0] + add_color, 0.0, 1.0);
	} else if( t <= u_ratios[1] ) {
		color = interpolate(t, u_ratios[0], u_ratios[1], u_colors[0], u_colors[1]);
	} else if( t <= u_ratios[2] ) {
		color = interpolate(t, u_ratios[1], u_ratios[2], u_colors[1], u_colors[2]);
	} else if( t <= u_ratios[3] ) {
		color = interpolate(t, u_ratios[2], u_ratios[3], u_colors[2], u_colors[3]);
	} else if( t <= u_ratios[4] ) {
		color = interpolate(t, u_ratios[3], u_ratios[4], u_colors[3], u_colors[4]);
	} else if( t <= u_ratios[5] ) {
		color = interpolate(t, u_ratios[4], u_ratios[5], u_colors[4], u_colors[5]);
	} else if( t <= u_ratios[6] ) {
		color = interpolate(t, u_ratios[5], u_ratios[6], u_colors[5], u_colors[6]);
	} else if( t <= u_ratios[7] ) {
		color = interpolate(t, u_ratios[6], u_ratios[7], u_colors[6], u_colors[7]);
	} else if( t <= u_ratios[8] ) {
		color = interpolate(t, u_ratios[7], u_ratios[8], u_colors[7], u_colors[8]);
	} else if( t <= u_ratios[9] ) {
		color = interpolate(t, u_ratios[8], u_ratios[9], u_colors[8], u_colors[9]);
	} else if( t <= u_ratios[10] ) {
		color = interpolate(t, u_ratios[9], u_ratios[10], u_colors[9], u_colors[10]);
	} else if( t <= u_ratios[11] ) {
		color = interpolate(t, u_ratios[10], u_ratios[11], u_colors[10], u_colors[11]);
	} else if( t <= u_ratios[12] ) {
		color = interpolate(t, u_ratios[11], u_ratios[12], u_colors[11], u_colors[12]);
	} else if( t <= u_ratios[13] ) {
		color = interpolate(t, u_ratios[12], u_ratios[13], u_colors[12], u_colors[13]);
	} else if( t <= u_ratios[14] ) {
		color = interpolate(t, u_ratios[13], u_ratios[14], u_colors[13], u_colors[14]);
	} else {
		color = clamp(mult_color * u_colors[14] + add_color, 0.0, 1.0);
	}

	if( u_interpolation != 0 ) {
		color = vec4(linear_to_srgb(vec3(color)), color.a);
	}

	float alpha = clamp(color.a, 0.0, 1.0);
	gl_FragColor = vec4(color.rgb * alpha, alpha);
}`;
	RenderWebGL.shader_blend_normal = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	return src + dst - dst * src.a;
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
RenderWebGL.shader_blend_add = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	vec4 c = vec4(dst.rgb + src.rgb, dst.a + src.a);
	return mix(c, src, step(1.0, 0.0));
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
RenderWebGL.shader_blend_subtract = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	vec4 c = vec4(dst.rgb - src.rgb, dst.a + src.a);
	return mix(c, src, step(dst.a, 0.0));
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_multiply = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	vec4 a = src - src * dst.a;
	vec4 b = dst - dst * src.a;
	vec4 c = src * dst;
	return a + b + c;
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_lighten = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	if (src.a > 0.0) {
		src.rgb /= src.a;
		vec4 c = vec4(mix(dst.rgb, src.rgb, step(dst.rgb, src.rgb)), 1.0) * src.a;
		return c + dst * (1.0 - src.a);
	} else {
	 	return dst;
	}
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_darken = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	if (dst.a == 0.0) {
		return src;
	} else if (src.a > 0.0) {
		src.rgb /= src.a;
		vec4 c = vec4(mix(dst.rgb, src.rgb, step(src.rgb, dst.rgb)), 1.0) * src.a;
		return c + dst * (1.0 - src.a);
	} else {
	 	return dst;
	}
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_screen = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	if (src.a > 0.0) {
		vec4 _src = src;
		vec4 _dst = dst;
		_src.rgb /= src.a;
		_dst.rgb /= dst.a;
		vec4 _out = _src;
		_out.r = (1.0 - ((1.0 - _src.r) * (1.0 - _dst.r)));
		_out.g = (1.0 - ((1.0 - _src.g) * (1.0 - _dst.g)));
		_out.b = (1.0 - ((1.0 - _src.b) * (1.0 - _dst.b)));
		return vec4(src.rgb * (1.0 - dst.a) + dst.rgb * (1.0 - src.a) + src.a * dst.a * _out.rgb, src.a + dst.a * (1.0 - src.a));
	} else {
		return dst;
	}
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_overlay = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D parent_texture;
uniform sampler2D current_texture;

varying vec2 frag_uv;

void main() {
	vec4 dst = texture2D(parent_texture, frag_uv);
	vec4 src = texture2D(current_texture, frag_uv);
	if (src.a > 0.0) {
		vec4 _src = src;
		vec4 _dst = dst;
		_src.rgb /= src.a;
		_dst.rgb /= dst.a;
		vec4 _out = _src;
		if (_dst.r <= 0.5) { _out.r = (2.0 * _src.r * _dst.r); } else { _out.r = (1.0 - 2.0 * (1.0 - _dst.r) * (1.0 - _src.r)); }
		if (_dst.g <= 0.5) { _out.g = (2.0 * _src.g * _dst.g); } else { _out.g = (1.0 - 2.0 * (1.0 - _dst.g) * (1.0 - _src.g)); }
		if (_dst.b <= 0.5) { _out.b = (2.0 * _src.b * _dst.b); } else { _out.b = (1.0 - 2.0 * (1.0 - _dst.b) * (1.0 - _src.b)); }
		gl_FragColor = vec4(src.rgb * (1.0 - dst.a) + dst.rgb * (1.0 - src.a) + src.a * dst.a * _out.rgb, src.a + dst.a * (1.0 - src.a));
	} else {
		gl_FragColor = dst;
	}
}`;
	RenderWebGL.shader_blend_hardlight = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	if (src.a > 0.0) {
		vec4 _src = src;
		vec4 _dst = dst;
		_src.rgb /= src.a;
		_dst.rgb /= dst.a;
		vec4 _out = _src;
		if (_src.r <= 0.5) { _out.r = (2.0 * _src.r * _dst.r); } else { _out.r = (1.0 - 2.0 * (1.0 - _dst.r) * (1.0 - _src.r)); }
		if (_src.g <= 0.5) { _out.g = (2.0 * _src.g * _dst.g); } else { _out.g = (1.0 - 2.0 * (1.0 - _dst.g) * (1.0 - _src.g)); }
		if (_src.b <= 0.5) { _out.b = (2.0 * _src.b * _dst.b); } else { _out.b = (1.0 - 2.0 * (1.0 - _dst.b) * (1.0 - _src.b)); }
		_out.a = 1.0;
		return vec4(src.rgb * (1.0 - dst.a) + dst.rgb * (1.0 - src.a) + src.a * dst.a * _out.rgb, src.a + dst.a * (1.0 - src.a));
	} else {
	 	return dst;
	}
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_difference = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D current_texture;
uniform sampler2D parent_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	if (src.a > 0.0) {
		src.rgb /= src.a;
		vec4 c = vec4(abs(src.rgb - dst.rgb), 1.0) * src.a;
		return c + dst * (1.0 - src.a);
	} else {
	 	return dst;
	}
}

void main() {
	vec4 src = texture2D(current_texture, frag_uv);
	vec4 dst = texture2D(parent_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	RenderWebGL.shader_blend_invert = `
#version 100

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform mat4 view_matrix;
uniform mat4 world_matrix;
uniform vec4 mult_color;
uniform vec4 add_color;
uniform mat3 u_matrix;

uniform sampler2D parent_texture;
uniform sampler2D current_texture;

varying vec2 frag_uv;

vec4 blend (in vec4 src, in vec4 dst) {
	if (src.a > 0.0) {
		vec4 c = vec4(1.0 - dst.rgb, 1.0) * src.a;
		return c + dst * (1.0 - src.a);
	} else {
	 	return dst;
	}
}

void main() {
	vec4 dst = texture2D(parent_texture, frag_uv);
	vec4 src = texture2D(current_texture, frag_uv);
	gl_FragColor = blend(src, dst);
}`;
	class H263Decoder {
		constructor(deblocking) {
			this.state = new AT_H263_Decoder.H263State({
				sorensonSpark: true,
				useScalabilityMode: false,
			});
			this.deblocking = deblocking;
		}
		preloadFrame(encodedFrame) {
			var reader = new AT_H263_Decoder.H263Reader(new Uint8Array(encodedFrame.data));
			let picture = this.state.parsePicture(reader, null);
			switch (picture.picture_type.getType()) {
				case "IFrame":
					return false;
				case "PFrame":
				case "DisposablePFrame":
					return true;
				default:
					throw new Error("Invalid picture type code: " + picture.picture_type.type);
			}
		}
		decodeFrame(encodedFrame) {
			var reader = new AT_H263_Decoder.H263Reader(new Uint8Array(encodedFrame.data));
			this.state.decodeNextPicture(reader);
			var picture = this.state.getLastPicture();
			let [y, b, r] = picture.as_yuv();
			let [width, height] = picture.format.intoWidthAndHeight();
			var yuv = new Uint8Array(y.length + b.length + r.length);
			yuv.set(y, 0);
			yuv.set(b, y.length);
			yuv.set(r, y.length + b.length);
			return new Bitmap(width, height, "yuv420p", yuv);
		}
	}
	class ByteReader {
		constructor(data) {
			this.data = new Uint8Array(data);
			this.offest = 0;
		}
		readByte() {
			if (this.offest >= this.data.length)
				throw new Error("Unexpected end of file");
			return this.data[this.offest++];
		}
		readUint16be() {
			var byte1 = this.readByte();
			var byte2 = this.readByte();
			return (byte1 << 8) | byte2;
		}
		readBuf(length) {
			if ((this.offest + length) > this.data.length)
				throw new Error("Unexpected end of file");
			var result = this.data.slice(this.offest, this.offest + length);
			this.offest += length;
			return result;
		}
	}
	class ScreenVideoDecoder {
		constructor(size, version) {
			this.version = version;
			this.w = 0;
			this.h = 0;
			this.blockW = 0;
			this.blockH = 0;
			this.width = size[0];
			this.height = size[1];
			this.lastFrame = null;
		}
		preloadFrame(encodedFrame) {
			var byte_input = new ByteReader(encodedFrame.data);
			var type = byte_input.readByte() >> 4;
			switch (type) {
				case 1:
					return 0;
				case 2:
					return 1;
				default:
					throw new Error("Invalid frame type: " + type);
			}
		}
		fillBlock(a, b, x, y, cur_w, cur_h) {
			for (let _y = 0; _y < cur_h; _y++) {
				for (let _x = 0; _x < cur_w; _x++) {
					var rgbIdx = (_x + (cur_w * ((cur_h - _y) - 1))) * 3;
					var idx = ((_x + x) + (this.w * (_y + y))) * 4;
					a[idx] = b[rgbIdx + 2];
					a[idx + 1] = b[rgbIdx + 1];
					a[idx + 2] = b[rgbIdx];
					a[idx + 3] = 255;
				}
			}
		}
		decodeFrame(encodedFrame) {
			var byte_input = new ByteReader(encodedFrame.data);
			var isKeyframe = byte_input.readByte() >> 4 == 1;
			if (!isKeyframe && !this.lastFrame)
				throw new Error("Missing reference frame");
			var hdr0 = byte_input.readUint16be();
			var blk_w = ((hdr0 >> 12) * 16) + 16;
			var w = hdr0 & 0xFFF;
			var hdr1 = byte_input.readUint16be();
			var blk_h = ((hdr1 >> 12) * 16) + 16;
			var h = hdr1 & 0xFFF;
			if (this.w != w || this.h != h || this.blockW != blk_w || this.blockH != blk_h) {
				this.w = w;
				this.h = h;
				this.blockW = blk_w;
				this.blockH = blk_h;
				this.lastFrame = new Uint8Array(w * h * 4);
			}
			var rgba = this.lastFrame;
			var is_intra = true;
			for (let yc = 0; yc < this.h; yc += this.blockH) {
				let cur_h = Math.min((this.h - yc), this.blockH);
				for (let xc = 0; xc < this.w; xc += this.blockW) {
					let cur_w = Math.min((this.w - xc), this.blockW);
					var dataSize = byte_input.readUint16be();
					if (dataSize > 0) this.fillBlock(rgba, new Uint8Array(ZLib.decompress(byte_input.readBuf(dataSize).buffer, (cur_w * cur_h) * 3)), xc, (this.h - yc) - cur_h, cur_w, cur_h);
					else is_intra = false;
				}
			}
			if (is_intra != isKeyframe)
				throw new Error("Not all blocks were updated by a supposed keyframe");
			return new Bitmap(w, h, "rgba", rgba);
		}
	}
	function crop(data, width, to_width, to_height) {
		let height = (data.length / width) | 0;
		if (width > to_width) {
			let new_width = to_width;
			let new_height = Math.min(height, to_height);
			let _data = new Uint8Array(new_width * new_height);
			for (let row = 0; row < new_height; row++) {
				_data.set(data.subarray(row * width, (row * width + new_width)), row * new_width);
			}
			return _data;
		} else {
			return data.subarray(0, width * Math.min(height, to_height));
		}
	}
	class VP6Decoder {
		constructor(size, withAlpha) {
			this.width = size[0];
			this.height = size[1];
			this.withAlpha = withAlpha;
			this.decoder = new AT_VP6_Decoder.VP56Decoder(6, withAlpha, true);
			this.support = new AT_VP6_Decoder.NADecoderSupport();
			this.bitreader = new AT_VP6_Decoder.VP6BR();
			this.initCalled = false;
			this.lastFrame = null;
		}
		preloadFrame(encodedFrame) {
			let flag_index = this.withAlpha ? 3 : 0;
			return new Uint8Array(encodedFrame.data)[flag_index] & 128;
		}
		decodeFrame(encodedFrame) {
			var videoData = new Uint8Array(encodedFrame.data);
			if (!this.initCalled) {
				var bool_coder = new AT_VP6_Decoder.BoolCoder(videoData.subarray(this.withAlpha ? 3 : 0));
				let header = this.bitreader.parseHeader(bool_coder);
				let video_info = new AT_VP6_Decoder.NAVideoInfo(header.disp_w * 16, header.disp_h * 16, true, this.withAlpha ? AT_VP6_Decoder.VP_YUVA420_FORMAT : AT_VP6_Decoder.YUV420_FORMAT);
				this.decoder.init(this.support, video_info);
				this.initCalled = true;
			}
			let decoded;
			var frame = null;
			decoded = this.decoder.decode_frame(this.support, videoData, this.bitreader);
			frame = decoded[0].value;
			let yuv = frame.get_data();
			let [width, height] = frame.get_dimensions(0);
			let [chroma_width, chroma_height] = frame.get_dimensions(1);
			let offsets = [
				frame.get_offset(0),
				frame.get_offset(1),
				frame.get_offset(2)
			];
			if ((width < this.width) || (height < this.height)) {
				console.log("A VP6 video frame is smaller than the bounds of the stream it belongs in. This is not supported.");
			}
			let y = yuv.subarray(offsets[0], offsets[0] + width * height);
			let u = yuv.subarray(offsets[1], offsets[1] + chroma_width * chroma_height);
			let v = yuv.subarray(offsets[2], offsets[2] + chroma_width * chroma_height);
			let _y = crop(y, width, this.width, this.height);
			let _u = crop(u, chroma_width, ((this.width + 1) / 2) | 0, ((this.height + 1) / 2) | 0);
			let _v = crop(v, chroma_width, ((this.width + 1) / 2) | 0, ((this.height + 1) / 2) | 0);
			width = this.width;
			height = this.height;
			if (this.withAlpha) {
				let [alpha_width, alpha_height] = frame.get_dimensions(3);
				let alpha_offset = frame.get_offset(3);
				let alpha = yuv.subarray(alpha_offset, alpha_offset + alpha_width * alpha_height);
				let a = crop(alpha, alpha_width, this.width, this.height);
				let yuvData = new Uint8Array(_y.length + _u.length + _v.length + a.length);
				yuvData.set(_y, 0);
				yuvData.set(_u, _y.length);
				yuvData.set(_v, _y.length + _u.length);
				yuvData.set(a, _y.length + _u.length + _v.length);
				return new Bitmap(width, height, "yuva420p", yuvData);
			} else {
				let yuvData = new Uint8Array(_y.length + _u.length + _v.length);
				yuvData.set(_y, 0);
				yuvData.set(_u, _y.length);
				yuvData.set(_v, _y.length + _u.length);
				return new Bitmap(width, height, "yuv420p", yuvData);
			}
		}
	}
	class VideoStream {
		constructor(decoder) {
			this.bitmap = null;
			this.decoder = decoder;
		}
	}
	class VideoBackend {
		constructor() {
			this.streams = new Set();
		}
		registerVideoStream(_num_frames, size, codec, filter) {
			var decoder;
			switch (codec) {
				case "none":
					decoder = null;
					break;
				case "H263":
					decoder = new H263Decoder(filter);
					break;
				case "ScreenVideo":
					decoder = new ScreenVideoDecoder(size, false);
					break;
				case "Vp6":
					decoder = new VP6Decoder(size, false);
					break;
				case "Vp6WithAlpha":
					decoder = new VP6Decoder(size, true);
					break;
				default:
					console.log("Unsupported video codec type " + codec);
			}
			var stream = new VideoStream(decoder);
			this.streams.add(stream);
			return stream;
		}
		preloadVideoStreamFrame(stream, encodedFrame) {
			return stream.decoder.preloadFrame(encodedFrame);
		}
		decodeVideoStreamFrame(stream, encodedFrame, renderer) {
			var _stream = stream;
			var decoder = _stream.decoder;
			var result = decoder.decodeFrame(encodedFrame);
			let handle;
			if (result || !stream.bitmap) {
				if (stream.bitmap) {
					handle = stream.bitmap;
					handle.setImage(result);
				} else {
					handle = renderer.createImageInterval();
					handle.setImage(result);
				}
			} else {
				handle = stream.bitmap;
			}
			stream.bitmap = handle;
			return handle;
		}
	}
	class MovieLibrary {
		constructor() {
			this.characters = new Map();
			this.exportCharacters = new Map();
			this.jpegTables = null;
		}
		characterById(id) {
			return this.characters.get(id);
		}
		registerCharacter(id, character) {
			if (!this.containsCharacter(id)) {
				this.characters.set(id, character);
			} else {
				console.log("Character ID collision: Tried to register ID twice: " + id);
			}
		}
		registerExport(id, exportName) {
			this.exportCharacters.set(exportName, id);
		}
		containsCharacter(id) {
			return this.characters.has(id);
		}
		instantiateById(id) {
			var c = this.characterById(id);
			if (c) {
				return this.instantiateDisplayObject(c);
			} else {
				console.log("Character id doesn't exist");
			}
		}
		instantiateDisplayObject(character) {
			switch (character.displayType) {
				case "Shape":
				case "MorphShape":
				case "StaticText":
				case "TextField":
				case "MovieClip":
				case "Buttom":
				case "Video":
				case "Bitmap":
					return character.instantiate();
				default:
					console.log("Not a DisplayObject", character);
			}
		}
		setJpegTables(jt) {
			if (this.jpegTables) {
				console.log("SWF contains multiple JPEGTables tags");
				return;
			}
			if (jt.byteLength) this.jpegTables = jt;
		}
	}
	class Library {
		constructor() {
			this.movieLibraries = new Map();
			this.deviceFont = null;
			this.avm2ClassRegistry = null;
		}
		libraryForMovie(movie) {
			return this.movieLibraries.get(movie);
		}
		libraryForMovieMut(movie) {
			if (this.movieLibraries.has(movie)) {
				return this.movieLibraries.get(movie);
			} else {
				var newMovie = new MovieLibrary();
				this.movieLibraries.set(movie, newMovie);
				return newMovie;
			}
		}
	}
	class UpdateContext {
		constructor(data) {
			for (var p in data) {
				this[p] = data[p];
			}
		}
		addInstanceCounter() {
			return this.player.addInstanceCounter();
		}
	}
	class RenderContext {
		constructor(data) {
			for (var p in data) {
				this[p] = data[p];
			}
		}
	}
	class ExecutionLimit {
		constructor(limit) {
			this.limit = limit;
		}
		didOpsBreachLimit(context, g) {
			this.limit -= g;
			return this.limit < 0;
		}
		terminate() {
			this.limit = -1;
		}
	}
	class Stage extends DisplayObjectContainer {
		constructor(fullscreen) {
			super();
			this._backgroundColor = null;
			this.child = new ChildContainer();
			this.movie_size = [0, 0];
			this.stage_size = [0, 0];
			this.viewport_matrix = [1, 0, 0, 1, 0, 0];
			this._movie = null;
		}
		rawContainer() {
			return this.child;
		}
		getBackgroundColor() {
			return this._backgroundColor;
		}
		setBackgroundColor(color) {
			this._backgroundColor = color.slice(0);
		}
		movie() {
			return this._movie;
		}
		setMovie(movie) {
			this._movie = movie;
		}
		getRootClip() {
			return this.childByDepth(0);
		}
		render(context) {
			context.transformStack.stackPush(this.viewport_matrix, [1, 1, 1, 1, 0, 0, 0, 0]);
			renderBase.call(this, context);
			context.transformStack.stackPop();
		}
	}
	class Player {
		constructor() {
			this.stage = null;
			this.version = 0;
			this.swf = null;
			this.isPlaying = true;
			this.needsRender = false;
			this.renderer = null;
			this.audio = null;
			this.frameRate = 30;
			this.frameAccumulator = 0;
			this.instanceCounter = 0;
			this.library = null;
			this.avm1 = null;
			this.loaded = false;
			this.callback = null;
		}
		get width() {
			var movie = this.swf;
			return movie ? movie.width : 0;
		}
		get height() {
			var movie = this.swf;
			return movie ? movie.height : 0;
		}
		build() {
			this.library = new Library();
			try {
				this.renderer = new RenderWebGL();
			} catch(e) {
				console.log(e);
				this.renderer = new RenderCanvas2d();
			}
			this.canvas = this.renderer.canvas;
			this.avm1 = new Avm1();
			this.audio = new AudioBackend();
			this.video = new VideoBackend();
			this.stage = new Stage("normal");
		}
		setPlaying(v) {
			if (v) this.audio.play();
			else this.audio.pause();
			this.isPlaying = v;
		}
		getVolume() {
			return this.audio.getVolume();
		}
		setVolume(volume) {
			this.audio.setVolume(volume);
		}
		resize(w, h) {
			this.needsRender = true;
			var scaleW = w / this.width;
			var scaleH = h / this.height;
			var scale = Math.min(Math.abs(scaleW), Math.abs(scaleH));
			var qScale = 1;
			if (this.getQuality() == "low") {
				qScale = 0.5;
			} else if (this.getQuality() == "medium") {
				qScale = 0.8;
			}
			if (this.getQuality() == "high") {
				qScale *= window.devicePixelRatio || 1;
			}
			var _w = Math.floor(this.width * scale);
			var _h = Math.floor(this.height * scale);
			this.renderer.resize(_w * qScale, _h * qScale);
			this.render();
		}
		getRootClip() {
			return this.stage.getRootClip();
		}
		togglePlayRootMovie(context) {
			var root = this.getRootClip();
			if (root.isPlaying()) {
				root.stop(context);
			} else {
				root.play(context);
			}
		}
		toggleLoopRootMovie(context) {
			var root = this.getRootClip();
			root.setIsLoop(!root.isLoop());
		}
		rewindRootMovie(context) {
			var root = this.getRootClip();
			root.gotoFrame(context, 1, true);
		}
		forwardRootMovie(context) {
			var root = this.getRootClip();
			root.nextFrame(context);
		}
		backRootMovie(context) {
			var root = this.getRootClip();
			root.prevFrame(context);
		}
		getQuality() {
			return this.renderer.quality;
		}
		setQuality(quality) {
			this.renderer.setQuality(quality);
		}
		loadSwfData(data) {
			var movie = SwfMovie.fromData(data);
			this.setRootMovie(movie);
		}
		preload(executionLimit) {
			return this.mutateWithUpdateContext((context) => {
				var did_finish = true;
				var root = this.getRootClip();
				did_finish = root.preload(context, executionLimit);
				return did_finish;
			});
		}
		getProgress() {
			var root = this.getRootClip();
			return [root.getLoadedBytes(), root.getTotalBytes()];
		}
		tick(dt) {
			var isF = this.preload(new ExecutionLimit(250000));
			if (this.isPlaying && isF) {
				this.frameAccumulator += dt;
				var frameTime = +(1000 / this.frameRate).toFixed(1);
				while (this.frameAccumulator >= frameTime) {
					this.frameAccumulator -= frameTime;
					this.runFrame();
				}
				this.audio.tick();
			}
		}
		render() {
			if (!this.needsRender) return;
			this.needsRender = false;
			var backgroundColor = [255, 255, 255, 1];
			var ts = new TransformStack();
			var scaleW = this.renderer.width / this.width;
			var scaleH = this.renderer.height / this.height;
			var scale = Math.min(Math.abs(scaleW), Math.abs(scaleH));
			ts.stackPush([scale / 20, 0, 0, scale / 20, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0]);
			var context = new RenderContext({
				library: this.library,
				renderer: this.renderer,
				commands: new CommandList(),
				transformStack: ts,
			});
			backgroundColor = this.stage.getBackgroundColor();
			if (!backgroundColor) backgroundColor = [255, 255, 255, 1];
			this.stage.render(context);
			ts.stackPop();
			this.renderer.submitFrame(backgroundColor, context.commands);
		}
		runFrame() {
			this.needsRender = true;
			this.mutateWithUpdateContext((context) => {
				this.avm1.runFrame(context);
			});
		}
		setRootMovie(movie) {
			this.swf = movie;
			this.frameRate = movie.frameRate;
			this.audio.setFrameRate(movie.frameRate);
			this.instanceCounter = 0;
			this.mutateWithUpdateContext((context) => {
				this.stage.movie_size[0] = context.swf.width;
				this.stage.movie_size[1] = context.swf.height;
				this.stage.setMovie(context.swf);
				var root = MovieClip.playerRootMovie(movie);
				root.setDepth(0);
				root.postInstantiation(context, null, "movie", false);
				root.setDefaultInstanceName(context);
				context.stage.replaceAtDepth(context, 0, root);
			});
			if (this.callback) this.callback();
		}
		mutateWithUpdateContext(callback) {
			var context = new UpdateContext({
				player: this,
				stage: this.stage,
				renderer: this.renderer,
				library: this.library,
				audio: this.audio,
				video: this.video,
				swf: this.swf,
				avm1: this.avm1,
			});
			let ret = callback(context);
			return ret;
		}
		addInstanceCounter() {
			return this.instanceCounter++;
		}
		destroy() {
			if (this.audio) this.audio.cleanup();
			this.renderer.destroy();
		}
	}
	const _getDuraction = function (num) {
		var txt = "";
		var _ms = Math.floor(num);
		var _mm = Math.floor(num / 60);
		var ms = _ms % 60;
		var mm = _mm % 60;
		var mh = Math.floor(num / 3600);
		if (_mm >= 60) txt += "" + mh, txt += ":";
		if (mm >= 10 || _ms < 600) txt += "" + mm;
		else txt += "0" + mm;
		txt += ":";
		if (ms >= 10) txt += "" + ms;
		else txt += "0" + ms;
		return txt;
	}
	const _getByteText = function (byte) {
		if (byte >= 1000000) {
			return "" + Math.floor(byte / 10000) / 100 + "MB";
		} else {
			if (byte >= 1000) {
				return "" + Math.floor(byte / 1000) + "KB";
			} else {
				return "" + byte + "B";
			}
		}
	}
	class Slot {
		constructor() {
			this._listeners = [];
		}
		subscribe(fn) {
			this._listeners.push(fn);
		}
		emit() {
			for (const listener of this._listeners) listener(...arguments);
		}
	}
	class ScreenCap {
		constructor() {
			this.canvas = document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");
		}
		scan(image, width, height) {
			this.canvas.width = width || image.width;
			this.canvas.height = height || image.height;
			this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
			return this.canvas.toDataURL();
		}
	}
	class PinkFiePlayer {
		constructor(options = {}) {
			this.onload = new Slot();
			this.onstartload = new Slot();
			this.oncleanup = new Slot();
			this.onerror = new Slot();
			this.onprogress = new Slot();
			this.onresume = new Slot();
			this.onpause = new Slot();
			this.onoptionschange = new Slot();
			this.MAGIC = {
				LARGE_Z_INDEX: "9999999999",
			};
			this.scanned = new ScreenCap();
			this.fullscreenEnabled = false;
			this.clickToPlayContainer = null;
			this.root = document.createElement("div");
			this.root.className = "pinkfie-player-root";
			this.playerContainer = document.createElement("div");
			this.playerContainer.className = "pinkfie-player-stage";
			this.root.appendChild(this.playerContainer);
			this.width = 0;
			this.height = 0;
			this._width = 0;
			this._height = 0;
			this.swfData = null;
			this.options = {};
			this._viewFrame = false;
			this.debugCanvas = document.createElement("canvas");
			this.debugCtx = this.debugCanvas.getContext("2d");
			this.debugCanvas.style.position = "absolute";
			this.debugCanvas.style.top = "0";
			this.debugCanvas.style.left = "0";
			this.debugCanvas.style.display = "none";
			this.playerContainer.appendChild(this.debugCanvas);
			this.resize(640, 400);
			this.initContextMenu();
			this.addStatsControls();
			this.addMessageVerticals();
			this.addSettingVerticals();
			this.startTime = Date.now();
			this.startTime2 = Date.now();
			this.isError = false;
			this.messageStatus = ["", 0, 1000, false];
			this._displayMessage = [0, "", 0, 1500];
			this.setOptions(Object.assign(Object.assign({}, options), PinkFiePlayer.DEFAULT_OPTIONS));
			window.addEventListener("resize", this.updateFullscreen.bind(this));
			document.addEventListener("fullscreenchange", this.onfullscreenchange.bind(this));
			document.addEventListener("mozfullscreenchange", this.onfullscreenchange.bind(this));
			document.addEventListener("webkitfullscreenchange", this.onfullscreenchange.bind(this));
			this.flash = null;
			setInterval(this.tick.bind(this), 10);
		}
		initContextMenu() {
			this.MenuVertical = document.createElement("div");
			this.MenuVertical.className = "watcher-pinkfie-menu-vertical";
			this.movie_playPause = this._createE("Pause", function () {
				this.toggleRunning();
				this.MenuVertical.style.display = "none";
			});
			this.MenuVertical.appendChild(this.movie_playPause);
			var controlsMC = [];
			this.movie_playStop = this._createE("Stop", function () {
				this.c_playStop();
				this.MenuVertical.style.display = "none";
			});
			this.movie_loopButton = this._createE('Loop: OFF', (e) => {
				e.preventDefault();
				this.c_loop();
				this.MenuVertical.style.display = 'none';
			});
			controlsMC.push(this.movie_playStop);
			controlsMC.push(this.movie_loopButton);
			controlsMC.push(this._createE("Rewind", function () {
				this.c_rewind();
				this.MenuVertical.style.display = "none";
			}));
			controlsMC.push(this._createE("Step Forward", function () {
				this.c_Forward();
				this.MenuVertical.style.display = "none";
			}));
			controlsMC.push(this._createE("Step Back", function () {
				this.c_Back();
				this.MenuVertical.style.display = "none";
			}));
			for (var i = 0; i < controlsMC.length; i++) {
				controlsMC[i].style.display = "none";
				this.MenuVertical.appendChild(controlsMC[i]);	
			}
			this._controlsMC = controlsMC;
			this.MenuVertical.appendChild(this._createE("View Stats", () => {
				this.viewStats();
				this.MenuVertical.style.display = "none";
			}));
			this.fullscreenButton = this._createE("Enter fullscreen", function () {
				if (this.fullscreenEnabled) {
					this.fullscreenButton.textContent = "Enter fullscreen";
					this.exitFullscreen();
				} else {
					this.fullscreenButton.textContent = "Exit fullscreen";
					this.enterFullscreen();
				}
				this.MenuVertical.style.display = "none";
			})
			this.MenuVertical.appendChild(this.fullscreenButton);
			this.MenuVertical.appendChild(this._createE("Save Screenshot", function () {
				this.saveScreenshot();
				this.MenuVertical.style.display = "none";
			}));
			this.movie_swfDownload = this._createE("Download SWF", function () {
				this.downloadSwf();
				this.MenuVertical.style.display = "none";
			});
			this.MenuVertical.appendChild(this.movie_swfDownload);
			this.MenuVertical.appendChild(this._createE("Settings", function () {
				this.showSetting();
				this.MenuVertical.style.display = "none";
			}));
			this.MenuVertical.style.display = "none";
			this.playerContainer.appendChild(this.MenuVertical);
			document.addEventListener("contextmenu", (e) => {
				if (this.flash) {
					if (e.target === this.flash.canvas || e.target === this.debugCanvas || e.target === this.clickToPlayContainer) {
						e.preventDefault();
						this.sendList(e);
					}
				}
			});
			document.addEventListener("click", (e) => {
				this.MenuVertical.style.display = "none";
			});
		}
		addSettingVerticals() {
			this.settingVertical = document.createElement("div");
			this.settingVertical.className = "watcher-pinkfie-setting";
			this.settingVertical.style = "backdrop-filter: blur(2px);";
			this.settingVertical.style.display = "none";
			this.settingVertical.style.overflow = "hidden";
			this.settingVertical.style.position = "relative";
			this.settingVertical.style.top = "0";
			this.settingVertical.style.left = "50%";
			this.settingVertical.style.padding = "6px";
			this.settingVertical.style.transform = "translate(-50%, 0)";
			this.settingVertical.style.background = "rgba(0, 0, 0, 0.6)";
			this.settingVertical.style.width = "320px";
			this.settingVertical.style.height = "auto";
			this.settingVertical.innerHTML = '<h3 style="margin:0;">Settings</h3>';

			var rrj2 = document.createElement("a");
			rrj2.onclick = () => {
				this.settingVertical.style.display = "none";
			};
			rrj2.style = "";
			rrj2.style.position = "fixed";
			rrj2.style.display = "block";
			rrj2.style.top = "2px";
			rrj2.style.right = "2px";
			rrj2.style["background-position"] = "50% 80%";
			rrj2.innerHTML = "[x]";

			var rrj3 = document.createElement("label");
			rrj3.innerHTML = "volume:";
			var rrj4 = document.createElement("input");
			rrj4.style.width = "70px";
			rrj4.type = "range";
			rrj4.value = 100;
			rrj4.max = 100;
			rrj4.min = 0;
			rrj4.addEventListener("input", () => {
				this.setOptions({
					volume: rrj4.value,
				});
			});
			this._rrj4 = rrj4;

			var rrj7 = document.createElement("label");
			rrj7.innerHTML = "Quality: ";

			var rrj8 = document.createElement("select");
			rrj8.innerHTML = '<option value="high">high<option value="medium">medium<option value="low">low';
			rrj8.addEventListener("change", () => {
				if (rrj8.value) {
					this.setOptions({
						quality: rrj8.value,
					});
				}
			});

			this.__rrj8 = rrj8;

			this.settingVertical.appendChild(rrj2);
			this.settingVertical.appendChild(rrj3);
			this.settingVertical.appendChild(rrj4);
			this.settingVertical.appendChild(rrj7);
			this.settingVertical.appendChild(rrj8);

			var a = document.createElement("label");
			a.innerHTML = "Jump Frame";

			var a2 = document.createElement("label");
			a2.innerHTML = "1/1";

			this.__a2 = a2;

			var fdfj = document.createElement("input");
			fdfj.type = "range";
			fdfj.value = 1;
			fdfj.min = 1;
			fdfj.max = 2;

			fdfj.addEventListener("input", () => {
				if (fdfj.value && this.flash) {
					var clip = this.flash.getRootClip();
					if (clip) this.c_gotoFrame(+fdfj.value, !clip.isPlaying());
				}
			});

			this.__fdfj = fdfj;

			var dfgdgd = document.createElement("div");

			dfgdgd.appendChild(a);
			dfgdgd.appendChild(fdfj);
			dfgdgd.appendChild(a2);

			this.__dfgdgd = dfgdgd;

			this.settingVertical.appendChild(document.createElement("br"));

			this.settingVertical.appendChild(dfgdgd);

			var rrj5 = document.createElement("label");
			rrj5.innerHTML = "Render Mode: ";

			var rrj6 = document.createElement("select");
			rrj6.innerHTML = '<option value="0">render<option value="1">render with display bounds<option value="2">display bounds without render';
			rrj6.addEventListener("change", () => {
				if (rrj6.value) {
					this.setOptions({
						rendermode: +rrj6.value,
					});
				}
			});

			this.settingVertical.appendChild(rrj5);
			this.settingVertical.appendChild(rrj6);

			this.playerContainer.appendChild(this.settingVertical);
		}
		addMessageVerticals() {
			this.messageE = document.createElement("div");
			this.messageE.style.color = "#fff";
			this.messageE.style.position = "absolute";
			this.messageE.style.background = "rgba(0,0,0,0.75)";
			this.messageE.style.backdropFilter = "blur(2px)";
			this.messageE.style.top = "0px";
			this.messageE.style.left = "0px";
			this.messageE.style.width = "100%";
			this.messageE.style.height = "auto";
			this.messageE.style.display = "none";

			var content = document.createElement("p");
			content.textContent = "Testing";

			content.style.margin = "2px";
			content.style.textAlign = "center";

			this.messageContentE = content;

			this.messageE.appendChild(content);

			this.playerContainer.appendChild(this.messageE);
		}
		addStatsControls() {
			this.statsE = document.createElement("div");
			this.statsE.style.color = "#fff";
			this.statsE.style.position = "absolute";
			this.statsE.style.top = "0px";
			this.statsE.style.left = "0px";
			this.statsE.style.fontSize = "15px";
			this.statsE.style.display = "none";

			var r = document.createElement("div");
			r.style.background = "rgba(0,0,0,0.75)";
			r.style.backdropFilter = "blur(2px)";
			r.style.padding = "3px 5px";
			r.style.margin = "3px";
			r.style.height = "auto";
			r.style.display = "none";
			r.style.fontSize = "12px";

			var playpause = document.createElement("div");
			playpause.textContent = "Pause";
			playpause.style.background = "rgba(0,0,0,0.75)";
			playpause.style.backdropFilter = "blur(2px)";
			playpause.style.padding = "3px 5px";
			playpause.style.margin = "3px";
			playpause.style.width = "auto";
			playpause.style.height = "auto";
			playpause.style.display = "none";
			playpause.style.fontSize = "12px";

			this.statsE_R = r;
			this.statsE_PP = playpause;

			this.statsE.appendChild(playpause);
			this.statsE.appendChild(r);

			this.playerContainer.appendChild(this.statsE);
		}
		_createE(name, fun) {
			var MVG1 = document.createElement("div");
			MVG1.textContent = name;
			MVG1.onclick = fun.bind(this);
			return MVG1;
		}
		sendList(event) {
			var rect = this.playerContainer.getBoundingClientRect();
			this.MenuVertical.style = "";
			this.MenuVertical.style.position = "absolute";
			this.MenuVertical.style.top = event.clientY - rect.top + "px";
			this.MenuVertical.style.left = event.clientX - rect.left + "px";
			this.MenuVertical.style.height = "auto";
			if (this.swfData) this.movie_swfDownload.style.display = "";
			else this.movie_swfDownload.style.display = "none";
			if (this.hasFlash() && this.flash.isPlaying) this.movie_playPause.innerHTML = "Pause";
			else this.movie_playPause.innerHTML = "Resume";
		}
		attach(child) {
			child.appendChild(this.root);
		}
		hasFlash() {
			return !!this.flash;
		}
		enableAttribute(name) {
			this.root.setAttribute(name, "");
		}
		disableAttribute(name) {
			this.root.removeAttribute(name);
		}
		setAttribute(name, enabled) {
			if (enabled) {
				this.enableAttribute(name);
			} else {
				this.disableAttribute(name);
			}
		}
		updateFullscreen() {
			if (!this.fullscreenEnabled) {
				this.applyResizeFlashPlayer();
				return;
			}
			this._resize(window.innerWidth, window.innerHeight);
			this.root.style.paddingLeft = "0px";
			this.root.style.paddingTop = "0px";
		}
		onfullscreenchange() {
			if (typeof document.fullscreen === "boolean" &&
				document.fullscreen !== this.fullscreenEnabled) {
				this.exitFullscreen();
			} else if (typeof document.webkitIsFullScreen === "boolean" &&
				document.webkitIsFullScreen !== this.fullscreenEnabled) {
				this.exitFullscreen();
			}
		}
		enterFullscreen() {
			if (true) {
				if (this.root.requestFullScreenWithKeys) {
					this.root.requestFullScreenWithKeys();
				} else if (this.root.webkitRequestFullScreen) {
					this.root.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				} else if (this.root.requestFullscreen) {
					this.root.requestFullscreen();
				}
			}
			document.body.classList.add("pinkfie-body-fullscreen");
			this.root.style.zIndex = this.MAGIC.LARGE_Z_INDEX;
			this.enableAttribute("fullscreen");
			this.fullscreenEnabled = true;
			this.updateFullscreen();
		}
		exitFullscreen() {
			this.disableAttribute("fullscreen");
			this.fullscreenEnabled = false;
			if (document.fullscreenElement === this.root ||
				document.webkitFullscreenElement === this.root) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
			this.root.style.zIndex = "";
			document.body.classList.remove("pinkfie-body-fullscreen");
			this._resize(this.width, this.height);
		}
		getOptions() {
			return this.options;
		}
		setOptions(changedOptions) {
			this.options = Object.assign(Object.assign({}, this.options), changedOptions);
			this._rrj4.value = this.options.volume;
			if (this.__rrj8) {
				this.__rrj8.value = this.options.quality;
			}
			if (this.hasFlash()) {
				this.applyOptionsToFlash();
			}
			this.onoptionschange.emit(changedOptions);
		}
		getRectStage() {
			var _movieCanvas = this.flash.canvas;
			var w = 0, h = 0, x = 0, y = 0;
			var __Width = this._width;
			var __Height = this._height;
			if (__Height - _movieCanvas.height * (__Width / _movieCanvas.width) < 0) {
				w = _movieCanvas.width * (__Height / _movieCanvas.height);
				h = _movieCanvas.height * (__Height / _movieCanvas.height);
				x = (__Width - w) / 2;
			} else {
				w = _movieCanvas.width * (__Width / _movieCanvas.width);
				h = _movieCanvas.height * (__Width / _movieCanvas.width);
				y = (__Height - h) / 2;
			}
			return [x, y, w, h];
		}
		renderBounds(fds) {
			var debctx = this.debugCtx;
			var debcanv = this.debugCanvas;
			var clip = this.flash.getRootClip();
			if (!clip) return;
			debctx.clearRect(0, 0, debcanv.width, debcanv.height);
			if (fds) {
				debctx.fillStyle = "#fff";
				debctx.fillRect(0, 0, debcanv.width, debcanv.height);
			}
			var rTags = [];
			clip.debugRenderBounds([debcanv.width / this.flash.width / 20, 0, 0, debcanv.height / this.flash.height / 20, 0, 0], [1, 1, 1, 1, 0, 0, 0, 0], rTags);
			var oCT = [1, 1, 1, 1, 0, 0, 0, 0];
			var oColor = [0, 0, 0, 1];
			var oTitle = "";
			for (let i = 0; i < rTags.length; i++) {
				const tag = rTags[i];
				var tid = tag[0];
				switch (tid) {
					case 0:
						debctx.setTransform(1, 0, 0, 1, 0, 0);
						debctx.strokeStyle = "rgba(" + generateColorTransform(oColor, oCT).join(",") + ")";
						debctx.lineWidth = 2;
						debctx.beginPath();
						debctx.moveTo(tag[1], tag[2]);
						debctx.lineTo(tag[3], tag[4]);
						debctx.lineTo(tag[5], tag[6]);
						debctx.lineTo(tag[7], tag[8]);
						debctx.lineTo(tag[1], tag[2]);
						debctx.stroke();
						break;
					case 1:
						debctx.setTransform(1, 0, 0, 1, 0, 0);
						debctx.strokeStyle = "rgba(" + generateColorTransform([0, 0, 0, 1], oCT).join(",") + ")";
						debctx.lineWidth = 2;
						debctx.beginPath();
						debctx.rect(tag[1], tag[2], tag[3] - tag[1], tag[4] - tag[2]);
						debctx.stroke();
						break;
					case 2:
						debctx.setTransform(1, 0, 0, 1, 0, 0);
						debctx.fillStyle = "rgba(" + generateColorTransform(oColor, oCT).join(",") + ")";
						debctx.textAlign = "left";
						debctx.font = "20px sans-serif";
						debctx.fillText(oTitle, tag[1], tag[2] - 7);
						break;
					case 3:
						oCT = tag[1];
						break;
					case 4:
						oTitle = tag[1];
						oColor[0] = tag[2];
						oColor[1] = tag[3];
						oColor[2] = tag[4];
						break;
				}
			}
		}
		handleError(e) {
			console.log(e);
			this.isError = true;
		}
		tick() {
			if (this.flash) {
				if (!this.isError) {
					var c = 3;
					var d = true;
					while ((c > 0) && ((Date.now() - this.startTime) >= 10) && d) {
						this.flash.tick(10);
						this.startTime += 10;
						c--;
						d = ((Date.now() - this.startTime2) <= 80);
					}
					if (!d) {
						this.startTime = Date.now();
					}
					this.startTime2 = Date.now();
				}
				var rend = this.options.rendermode;
				if (rend == 1 || rend == 2) {
					this.debugCanvas.style.display = "";
					this.renderBounds(rend == 2);
				} else {
					this.debugCanvas.style.display = "none";
				}
				if (rend == 0 || rend == 1) this.flash.render();
				var gloaded = this.flash.getProgress();
				if (gloaded[0] == gloaded[1]) {
					this.messageStatus[1] = 0;
					this.messageStatus[3] = true;
				} else {
					this.messageStatus[0] = "\u23F3 Building Tags: " + _getByteText(gloaded[0]) + " / " + _getByteText(gloaded[1]);
					this.messageStatus[1] = 1000;
					this.messageStatus[2] = Date.now();
					this.messageStatus[3] = true;
				}
				if (this._displayMessage[0] == 1) {
					if (!this.flash.isPlaying) {
						this._displayMessage[2] = Date.now();
					}
					if (this.flash.isPlaying) {
						this._displayMessage[1] = "Play";
					} else {
						this._displayMessage[1] = "Pause";
					}
				}
				var rrgg = Date.now() - this._displayMessage[2] < this._displayMessage[3];
				if (this._displayMessage[0] && rrgg) {
					var GSGGG = this._displayMessage[1];
					this.statsE_PP.textContent = GSGGG;
					this.statsE_PP.style.display = "inline-block";
				} else {
					if (this._displayMessage[0] !== 1) {
						if (this._displayMessage[0]) {
							if (this.clickToPlayContainer) {
								this._displayMessage[0] = 0;
							} else {
								this._displayMessage[0] = 1;
							}
						}
					}
					this.statsE_PP.style.display = "none";
				}
				var clip = this.flash.getRootClip();
				if (clip) {
					this.__a2.textContent = clip.currentFrame() + "/" + clip.totalframes();
					if (clip.totalframes() > 1) {
						this.__fdfj.min = 1;
						this.__fdfj.max = clip.totalframes();
						this.__fdfj.value = clip.currentFrame();
					} else {
						this.__fdfj.min = 1;
						this.__fdfj.max = 2;
					}
				}
			} else {
				this.startTime = Date.now();
				this.startTime2 = Date.now();
				this.__fdfj.min = 1;
				this.__fdfj.max = 2;
			}
			if (this._viewFrame && this.flash) {
				var clip = this.flash.getRootClip();
				if (clip) {
					var _r = _getDuraction((clip.currentFrame() / clip.framesloaded()) * (clip.framesloaded() / this.flash.frameRate)) + "/" + _getDuraction(clip.framesloaded() / this.flash.frameRate);
					var _u = clip.currentFrame() + "/" + clip.framesloaded();
					var hkj = "Time: " + _r;
					hkj += "<br>Frame: " + _u;
					this.statsE_R.style.display = "";
					this.statsE_R.innerHTML = hkj;
				}
			} else {
				this.statsE_R.style.display = "none";
			}
			if (this.isPlayMovie()) this.movie_playStop.innerHTML = "Stop";
			else this.movie_playStop.innerHTML = "Play";
			if (this.isLoopMovie()) this.movie_loopButton.innerHTML = "Loop: ON";
			else this.movie_loopButton.innerHTML = "Loop: OFF";
			if (this.messageStatus[3] && Date.now() - this.messageStatus[2] > this.messageStatus[1]) {
				this.messageE.style.display = "none";
			} else {
				this.messageContentE.textContent = this.messageStatus[0];
				this.messageE.style.display = "";
			}
		}
		viewStats() {
			if (this._viewFrame) {
				this._viewFrame = false;
			} else {
				this._viewFrame = true;
			}
		}
		setFlashPlayer(flash) {
			this.flash = flash;
			this.flash.isPlaying = this.options.autoplay;
			this.statsE.style.display = "";
			var totalframes = flash.swf.numFrames;
			this.__dfgdgd.style.display = (totalframes > 1) ? "" : "none";
			for (var i = 0; i < this._controlsMC.length; i++) {
				this._controlsMC[i].style.display = (totalframes > 1) ? "" : "none";
			}
			this.playerContainer.insertBefore(flash.canvas, this.playerContainer.childNodes[0]);
			this.applyOptionsToFlash();
			this.applyResizeFlashPlayer();
			this.onload.emit(flash);
			this.applyAutoplayPolicy(this.flash.isPlaying);
		}
		applyOptionsToFlash() {
			if (this.flash) {
				this.flash.setVolume(this.options.volume / 100);
				var renderDirty = false;
				if (this.flash.getQuality() != this.options.quality) {
					this.flash.setQuality(this.options.quality);
					renderDirty = true;
				}
				if (renderDirty) this.applyResizeFlashPlayer();
			}
		}
		applyResizeFlashPlayer() {
			if (this.flash) {
				this.flash.resize(this._width, this._height);
				var rect = this.getRectStage();
				var canvas = this.flash.canvas;
				canvas.style.margin = "0";
				canvas.style.position = "absolute";
				canvas.style.left = rect[0] + "px";
				canvas.style.top = rect[1] + "px";
				canvas.style.width = rect[2] + "px";
				canvas.style.height = rect[3] + "px";
				this.debugCanvas.style.left = rect[0] + "px";
				this.debugCanvas.style.top = rect[1] + "px";
				this.debugCanvas.width = canvas.width;
				this.debugCanvas.height = canvas.height;
				this.debugCanvas.style.height = rect[3] + "px";
				this.debugCanvas.style.width = rect[2] + "px";
				this.statsE.style.left = rect[0] + "px";
				this.statsE.style.top = rect[1] + "px";
				var rend = this.options.rendermode;
				if (rend == 1 || rend == 2) {
					this.debugCanvas.style.display = "";
					this.renderBounds(rend == 2);
				} else {
					this.debugCanvas.style.display = "none";
				}
			}
		}
		resize(w, h) {
			this.width = w;
			this.height = h;
			if (!this.fullscreenEnabled) this._resize(w, h);
		}
		_resize(w, h) {
			this._width = w;
			this._height = h;
			this.playerContainer.style.width = w + "px";
			this.playerContainer.style.height = h + "px";
			this.applyResizeFlashPlayer();
		}
		fetchSwfMd5(md5, callback, callbackProgress) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				callback(new Uint8Array(xhr.response.slice(0x2c)));
			};
			xhr.onprogress = function (e) {
				if (callbackProgress) callbackProgress(e.loaded / e.total);
			};
			xhr.onerror = function () {
				callback(null);
			};
			xhr.responseType = "arraybuffer";
			xhr.open("GET", "https://assets.scratch.mit.edu/internalapi/asset/" + md5 + ".wav/get/");
			xhr.send();
		}
		fetchSwfUrl(url, callback, callbackProgress) {
			var _this = this;
			var xhr = new XMLHttpRequest();
			if (Array.isArray(url)) {
				var result = [];
				var id_md5 = 0;
				function _excgfd() {
					if (result.length > 1) {
						var len = 0;
						for (var i = 0; i < result.length; i++)
							len += result[i].length;
						var res = new Uint8Array(len);
						var offest = 0;
						for (var i = 0; i < result.length; i++) {
							res.set(result[i], offest);
							offest += result[i].length;
						}
						callback(new Blob([res]), null);
					} else {
						callback(new Blob([result[0]]), null);
					}
				}
				function _next() {
					_this.fetchSwfMd5(url[id_md5], function (res) {
						if (!res) {
							callback(null, "failed md5: " + url[id_md5]);
							return;
						}
						id_md5++;
						result.push(res);
						if (id_md5 >= url.length) {
							_excgfd();
						} else {
							_next();
						}
					}, function (_p) {
						if (callbackProgress) callbackProgress((id_md5 / url.length) + (_p / url.length));
					});
				}
				_next();
			} else {
				xhr.onload = function () {
					if (xhr.status !== 200) {
						callback(null, xhr.status, xhr.statusText ? xhr.statusText : xhr.status);
					} else {
						var dat = new Uint8Array(xhr.response);
						callback(new Blob([dat]), null);
					}
				};
				xhr.onprogress = function (e) {
					if (callbackProgress) callbackProgress(e.loaded / e.total);
				};
				xhr.onerror = function () {
					callback(null, "unknown");
				};
				xhr.responseType = "arraybuffer";
				xhr.open("GET", url);
				xhr.send();
			}
		}
		loadSwfFromFile(file) {
			this.beginLoadingSWF();
			this.messageStatus[0] = "\u23F3 Loading SWF Data";
			this.messageStatus[3] = false;
			this.messageE.style.display = "";
			this.messageContentE.textContent = "\u23F3 Loading SWF Data";
			this.loadLoader(file);
		}
		loadLoader(file) {
			this.messageStatus[0] = "\u23F3 Descompressing SWF";
			this.messageStatus[3] = false;
			this.messageE.style.display = "";
			this.messageContentE.textContent = this.messageStatus[0];
			var _this = this;
			var flash = new Player();
			flash.build();
			flash.callback = function () {
				_this.setFlashPlayer(flash);
			};
			var r = new FileReader();
			r.onload = function (e) {
				flash.loadSwfData(e.target.result);
			};
			r.readAsArrayBuffer(file);
		}
		loadSwfFromURL(url) {
			this.beginLoadingSWF();
			this.messageStatus[0] = "\u23F3 Loading SWF Data";
			this.messageStatus[3] = false;
			this.messageE.style.display = "";
			this.messageE.title = "";
			var _this = this;
			this.fetchSwfUrl(url, function (file, status, statusText) {
				_this.swfData = file;
				if (file) {
					_this.loadLoader(file);
				} else {
					_this.messageStatus[0] = "Failed to load SWF: " + status;
					_this.messageStatus[3] = false;
					_this.messageE.title = statusText || "";
					_this.messageE.style.display = "";
					_this.messageContentE.textContent = _this.messageStatus[0];
				}
			}, function (e) {
				_this.messageStatus[0] = "\u23F3 Loading SWF Data " + Math.round(e * 100) + "%";
				_this.messageStatus[3] = false;
			});
		}
		showSetting() {
			this.settingVertical.style.display = "";
		}
		getSwfName() {
			var swf = this.flash.swf;
			return ("pinkfie_" + swf.header.compression + "_" + swf.version + "_" + swf.uncompressedLength + "_fps" + swf.frameRate + "_frames" + swf.numFrames);
		}
		saveScreenshot() {
			if (!this.hasFlash()) return;
			this.flash.render();
			var _movieCanvas = this.flash.canvas;
			var j = this.getSwfName();
			var h = this.scanned.scan(_movieCanvas);
			var a = document.createElement("a");
			a.href = h;
			a.download = j + ".png";
			a.click();
		}
		downloadSwf() {
			if (!this.hasFlash()) return;
			var j = this.getSwfName();
			var h = URL.createObjectURL(this.swfData);
			var a = document.createElement("a");
			a.href = h;
			a.download = j + ".swf";
			a.click();
		}
		toggleRunning() {
			if (this.flash) {
				if (this.clickToPlayContainer) this.removeClickToPlayContainer();
				this._displayMessage[0] = 1;
				this.flash.setPlaying(!this.flash.isPlaying);
			}
		}
		isPlayMovie() {
			if (!this.hasFlash()) return false;
			if (this.flash.getRootClip()) return this.flash.getRootClip().isPlaying();
			return false;
		}
		isLoopMovie() {
			if (!this.hasFlash()) return false;
			if (this.flash.getRootClip()) return this.flash.getRootClip().isLoop();
			return false;
		}
		c_playStop() {
			if (!this.hasFlash()) return;
			this.flash.mutateWithUpdateContext((context) => {
				this.flash.togglePlayRootMovie(context);
			});
		}
		c_loop() {
			if (!this.hasFlash()) return;
			this.flash.mutateWithUpdateContext((context) => {
				this.flash.toggleLoopRootMovie(context);
			});
		}
		c_rewind() {
			if (!this.hasFlash()) return;
			this.flash.mutateWithUpdateContext((context) => {
				this.flash.rewindRootMovie(context);
			});
		}
		c_Forward() {
			if (!this.hasFlash()) return;
			this.flash.mutateWithUpdateContext((context) => {
				this.flash.forwardRootMovie(context);
			});
		}
		c_Back() {
			if (!this.hasFlash()) return;
			this.flash.mutateWithUpdateContext((context) => {
				this.flash.backRootMovie(context);
			});
		}
		c_gotoFrame(frame, stop) {
			if (!this.hasFlash()) return;
			this.flash.mutateWithUpdateContext((context) => {
				this.flash.getRootClip().gotoFrame(context, frame, stop);
			});
		}
		beginLoadingSWF() {
			this.cleanup();
			this.onstartload.emit();
		}
		applyAutoplayPolicy(policy) {
			if (policy) {
				this.triggerStartMovie();
			} else {
				this.showClickToPlayContainer();
			}
		}
		triggerStartMovie() {
			this.flash.setPlaying(true);
			if (this.clickToPlayContainer) this.removeClickToPlayContainer();
		}
		showClickToPlayContainer() {
			if (!this.clickToPlayContainer) {
				this.clickToPlayContainer = document.createElement("div");
				this.clickToPlayContainer.className =
					"pinkfie-player-click-to-play-container";
				this.clickToPlayContainer.onclick = () => {
					this.removeClickToPlayContainer();
					this.triggerStartMovie();
				};
				const content = document.createElement("div");
				content.className = "pinkfie-player-click-to-play-icon";
				this.clickToPlayContainer.appendChild(content);
				this.playerContainer.insertBefore(
					this.clickToPlayContainer,
					this.playerContainer.childNodes[2]
				);
			}
		}
		removeClickToPlayContainer() {
			if (this.clickToPlayContainer) {
				this.playerContainer.removeChild(this.clickToPlayContainer);
				this.clickToPlayContainer = null;
			}
		}
		cleanup() {
			this.isError = false;
			this.debugCanvas.style.display = "none";
			for (var i = 0; i < this._controlsMC.length; i++) {
				this._controlsMC[i].style.display = "none";
			}
			if (this.clickToPlayContainer) this.removeClickToPlayContainer();
			if (this.flash) {
				this.flash.destroy();
				this.playerContainer.removeChild(this.flash.canvas);
				this.flash = null;
			}
			this._displayMessage[0] = 0;
			this.swfData = null;
			this.oncleanup.emit();
		}
	}
	PinkFiePlayer.DEFAULT_OPTIONS = {
		volume: 100,
		quality: "high",
		autoplay: true,
		rendermode: 0,
	};
	return {
		createPlayer: function() {
			return new PinkFiePlayer();
		},
		SwfInput
	}
}());