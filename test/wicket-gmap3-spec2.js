var Wkt = Wicket.Wkt;
describe('Standard WKT Test Cases: ', function () {
	var cases, wkt;

	wkt = new Wkt.Wkt();

	var cases = {

		polygon2: {
			str: 'POLYGON((35 10,45 45,15 40,10 20,35 10),(21 30,35 35,30 20,21 30))',
			cmp: [
				[{
					x: 35,
					y: 10
				}, {
					x: 45,
					y: 45
				}, {
					x: 15,
					y: 40
				}, {
					x: 10,
					y: 20
				}, {
					x: 35,
					y: 10
				}],
				[{
					x: 21,
					y: 30
				}, {
					x: 35,
					y: 35
				}, {
					x: 30,
					y: 20
				}, {
					x: 21,
					y: 30
				}]
			],
			obj: new google.maps.Polygon({
				editable: false,
				paths: [
					[
						new google.maps.LatLng(10, 35),
						new google.maps.LatLng(45, 45),
						new google.maps.LatLng(40, 15),
						new google.maps.LatLng(20, 10)
					],
					[ // Order in inner rings is reversed
						new google.maps.LatLng(30, 21),
						new google.maps.LatLng(35, 35),
						new google.maps.LatLng(20, 30)
					]
				]
			}),
			json: {
				'coordinates': [
					[
						[35, 10],
						[45, 45],
						[15, 40],
						[10, 20],
						[35, 10]
					],
					[
						[21, 30],
						[35, 35],
						[30, 20],
						[21, 30]
					]
				],
				'type': 'Polygon'
			},
			jsonStr: '{"coordinates": [[[35, 10], [45, 45], [15, 40], [10, 20], [35, 10]], [[21, 30], [35, 35], [30, 20], [21, 30]]], "type": "Polygon"}'
		},

		multipolygon2: {
			str: 'MULTIPOLYGON(((40 40,20 45,45 30,40 40)),((20 35,10 30,10 10,30 5,45 20,20 35),(30 20,20 15,20 25,30 20)))',
			cmp: [
				[
					[{
						x: 40,
						y: 40
					}, {
						x: 20,
						y: 45
					}, {
						x: 45,
						y: 30
					}, {
						x: 40,
						y: 40
					}, ]
				],
				[
					[{
						x: 20,
						y: 35
					}, {
						x: 10,
						y: 30
					}, {
						x: 10,
						y: 10
					}, {
						x: 30,
						y: 5
					}, {
						x: 45,
						y: 20
					}, {
						x: 20,
						y: 35
					}, ],
					[{
						x: 30,
						y: 20
					}, {
						x: 20,
						y: 15
					}, {
						x: 20,
						y: 25
					}, {
						x: 30,
						y: 20
					}]
				]
			],
			obj: [
				new google.maps.Polygon({
					editable: false,
					paths: [
						[
							new google.maps.LatLng(40, 40),
							new google.maps.LatLng(45, 20),
							new google.maps.LatLng(30, 45)
						]
					]
				}),
				new google.maps.Polygon({
					editable: false,
					paths: [
						[
							new google.maps.LatLng(35, 20),
							new google.maps.LatLng(30, 10),
							new google.maps.LatLng(10, 10),
							new google.maps.LatLng(5, 30),
							new google.maps.LatLng(20, 45)
						],
						[
							new google.maps.LatLng(20, 30),
							new google.maps.LatLng(15, 20),
							new google.maps.LatLng(25, 20),

						]
					]
				})
			],
			json: {
				'coordinates': [
					[
						[
							[40, 40],
							[20, 45],
							[45, 30],
							[40, 40]
						]
					],
					[
						[
							[20, 35],
							[10, 30],
							[10, 10],
							[30, 5],
							[45, 20],
							[20, 35]
						],
						[
							[30, 20],
							[20, 15],
							[20, 25],
							[30, 20]
						]
					]
				],
				'type': 'MultiPolygon'
			},
			jsonStr: '{"coordinates": [[[[40, 40], [20, 45], [45, 30], [40, 40]]], [[[20, 35], [10, 30], [10, 10], [30, 5], [45, 20], [20, 35]], [[30, 20], [20, 15], [20, 25], [30, 20]]]], "type": "MultiPolygon"}'
		}
	};

	describe('Converting objects into WKT strings: ', function () {

		afterEach(function () {
			wkt.delimiter = ' ';
		});

		it('should convert a Polygon instance with a hole into a POLYGON string with the same hole', function () {
			wkt.fromObject(cases.polygon2.obj);
			expect(wkt.type).toBe('polygon');
			expect(wkt.isCollection()).toBe(true);
			expect(wkt.write()).toBe(cases.polygon2.str);
			expect(wkt.components).toEqual(cases.polygon2.cmp);

		});

		it('should convert an Array of Polygon instances, some with holes, into a MULTIPOLYGON string with the same hole', function () {
			wkt.fromObject(cases.multipolygon2.obj);
			expect(wkt.type).toBe('multipolygon');
			expect(wkt.isCollection()).toBe(true);
			expect(wkt.write()).toBe(cases.multipolygon2.str);
			expect(wkt.components).toEqual(cases.multipolygon2.cmp);
		});

	});

});
