// src/data/recipes.ts

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'any';
export type RecipeCategory =
    | 'main'
    | 'snack'
    | 'drink'
    | 'dessert'
    | 'breakfast'
    | 'salad'
    | 'soup'
    | 'alcohol';

export interface Recipe {
    id: string;                 // slug duy nhất
    title: string;              // tên món
    slots: MealSlot[];          // bữa nào ăn
    category: RecipeCategory;   // nhóm món
    origin?: string;            // nước / vùng
    youtube?: string;           // link video
    image: string;              // 1 hình chính
    images?: string[];          // thêm hình (nếu muốn dùng sau)
}

// ===== MAIN DISHES – LUNCH / DINNER =====

export const RECIPES: Recipe[] = [
    {
        id: 'spaghetti-meat-sauce',
        title: 'Spaghetti with Meat Sauce',
        slots: ['lunch', 'dinner'],
        category: 'main',
        origin: 'Italy',
        youtube: 'https://youtube.com/shorts/IT2qXIRqLeU?si=pcIoP38N_Mq0-2Ks',
        image:
            'https://i.pinimg.com/736x/0b/da/22/0bda2231163c662d1407d0ce9ca84b17.jpg',
        images: [
            'https://i.pinimg.com/736x/03/a6/e4/03a6e4fe500a471f98533a3144a89aae.jpg',
            'https://i.pinimg.com/736x/68/4c/a1/684ca1498560c84097bebc3805da551b.jpg',
            'https://i.pinimg.com/736x/e1/b8/8a/e1b88a574e9fcab4eb5f0a93a9201b01.jpg',
        ],
    },
    {
        id: 'pho-bo',
        title: 'Vietnamese Beef Pho',
        slots: ['breakfast'],
        category: 'soup',
        origin: 'Vietnam',
        youtube: 'https://youtu.be/bR3rVyy6RfY?si=NTXzQtNyJ5ltUKbP',
        image:
            'https://i.pinimg.com/1200x/71/be/38/71be38e661f54b84d359cf5bb4250624.jpg',
        images: [
            'https://i.pinimg.com/736x/c6/d1/15/c6d115043b40d939386e5e32ecea49f3.jpg',
            'https://i.pinimg.com/736x/bc/56/a0/bc56a04364cea48751be6c17d8bab87f.jpg',
            'https://i.pinimg.com/736x/8b/7e/e4/8b7ee490ffd1c8ef6289288eddc0eeab.jpg',
        ],
    },
    {
        id: 'bun-cha',
        title: 'Bún Chả',
        slots: ['breakfast', 'lunch'],
        category: 'main',
        origin: 'Vietnam',
        youtube: 'https://youtu.be/4MpMXIN79GA?si=lG5CDOyilDOv7-Jk',
        image:
            'https://i.pinimg.com/1200x/5f/7c/a0/5f7ca04bee500c53272e1534954f2712.jpg',
        images: [
            'https://i.pinimg.com/736x/8f/15/2c/8f152c3b7e45055e46e960a836af2391.jpg',
            'https://i.pinimg.com/736x/89/e8/dd/89e8dd31454589045483897b92006879.jpg',
            'https://i.pinimg.com/736x/58/a1/ce/58a1ce9578d5668ecf2c4672866bca43.jpg',
        ],
    },
    {
        id: 'fish-and-chips',
        title: 'Fish and Chips',
        slots: ['dinner'],
        category: 'main',
        origin: 'UK',
        youtube: 'https://youtube.com/shorts/nfZ3-4p9kn8?si=hX6V6RKYZLuS6TOy',
        image:
            'https://i.pinimg.com/736x/0d/05/ea/0d05ea5cb352ba881067605fc234832c.jpg',
        images: [
            'https://i.pinimg.com/736x/bb/e0/ee/bbe0eec3c62cb743ce1291aa3b45baf4.jpg',
            'https://i.pinimg.com/1200x/4d/d6/9b/4dd69b7325aae5b3fc3696dcc3999ce3.jpg',
            'https://i.pinimg.com/736x/a0/c2/ec/a0c2eccf7e3d6f98741ee6f645b3805f.jpg',
        ],
    },
    {
        id: 'ratatouille',
        title: 'Ratatouille',
        slots: ['lunch', 'dinner'],
        category: 'main',
        origin: 'France',
        youtube: 'https://youtu.be/b3H1utLhVBM?si=Y4x13In0CcYVsMFi',
        image:
            'https://i.pinimg.com/1200x/dd/5c/a3/dd5ca397d549198d4feb9c3f63434419.jpg',
        images: [
            'https://i.pinimg.com/736x/46/6b/81/466b8110c6c5cda72541ca61bb0fb3f9.jpg',
            'https://i.pinimg.com/1200x/72/e7/68/72e768e0cfccc010c4b0c5b7f18be4e2.jpg',
            'https://i.pinimg.com/736x/c1/d8/67/c1d8671912ecca69d76bd917f1d9d9ef.jpg',
        ],
    },
    {
        id: 'roast-chicken',
        title: 'Classic Roast Chicken',
        slots: ['dinner'],
        category: 'main',
        origin: 'Western',
        youtube: 'https://youtu.be/GiyOpq_C7fw?si=Jgr1H7feEorEbYhO',
        image:
            'https://i.pinimg.com/736x/f1/da/1d/f1da1d00b915409998c634666ba1cadb.jpg',
        images: [
            'https://i.pinimg.com/736x/6b/e0/2e/6be02ec298bc41da2dcea369ed7d7222.jpg',
            'https://i.pinimg.com/736x/76/38/7c/76387c4eb94ebf26f6f3c5120f77871d.jpg',
            'https://i.pinimg.com/1200x/c3/71/1c/c3711cd52496c3d7a4baf0896721dab6.jpg',
        ],
    },
    {
        id: 'bruschetta',
        title: 'Tomato Bruschetta',
        slots: ['lunch', 'dinner'],
        category: 'snack',
        origin: 'Italy',
        youtube: 'https://youtu.be/kzLTMAUQWkI?si=BTS4M2CvymRlUcGJ',
        image:
            'https://i.pinimg.com/736x/ff/51/de/ff51de60f4e3fe446df3bbf9dc9d0d45.jpg',
        images: [
            'https://i.pinimg.com/1200x/cf/1a/d6/cf1ad69fef708ab32f89079dac6ac931.jpg',
            'https://i.pinimg.com/736x/ab/20/f5/ab20f574e7e4c26a7962fd3fbeaf68e8.jpg',
            'https://i.pinimg.com/736x/b6/45/a0/b645a00d4b4efa3f4a3dd75cbfee7de1.jpg',
        ],
    },
    {
        id: 'creme-brulee',
        title: 'Crème Brûlée',
        slots: ['lunch', 'dinner'],
        category: 'dessert',
        origin: 'France',
        youtube: 'https://youtu.be/ZPz7FP15OCs?si=FPCX6751u6-3dF_C',
        image:
            'https://i.pinimg.com/736x/1a/3c/e6/1a3ce6efcf78f0fbcd022206b6458acb.jpg',
        images: [
            'https://i.pinimg.com/1200x/1a/3c/e6/1a3ce6efcf78f0fbcd022206b6458acb.jpg',
            'https://i.pinimg.com/736x/6f/b9/41/6fb9413ea60315a65ef7588dedcae4c5.jpg',
            'https://i.pinimg.com/736x/34/81/fe/3481fed3acc3739dbf224f8306173948.jpg',
        ],
    },
    {
        id: 'pad-thai',
        title: 'Pad Thai',
        slots: ['lunch', 'dinner'],
        category: 'main',
        origin: 'Thailand',
        youtube: 'https://youtu.be/Pvl8LIDOhWw?si=ZETBo4ibZ2RmVG42',
        image:
            'https://i.pinimg.com/1200x/2a/5e/8a/2a5e8a907d7251e615def015b7ae8e6b.jpg',
        images: [
            'https://i.pinimg.com/1200x/98/c9/5d/98c95df876af9448fe3da03c0a9507cc.jpg',
            'https://i.pinimg.com/1200x/21/db/41/21db410a462bb819f59899a4c14cdd36.jpg',
            'https://i.pinimg.com/1200x/4c/63/68/4c636866382b3142b22b04c1ffd2e133.jpg',
        ],
    },
    {
        id: 'ramen',
        title: 'Simple Japanese Ramen',
        slots: ['lunch'],
        category: 'soup',
        origin: 'Japan',
        youtube: 'https://youtube.com/shorts/YjANVA2JtlE?si=2CnegAaOPSHsKrye',
        image:
            'https://i.pinimg.com/736x/68/81/d7/6881d79053c11639a8f9b31006fb68db.jpg',
        images: [
            'https://i.pinimg.com/736x/c0/42/b7/c042b7a16ef831a946b1770b854fc6d9.jpg',
            'https://i.pinimg.com/1200x/e4/9e/86/e49e86213b827841ac8c2a93803f37b6.jpg',
            'https://i.pinimg.com/736x/d2/a2/64/d2a264ec2995ffe741dc3adcae997760.jpg',
        ],
    },
    {
        id: 'boeuf-bourguignon',
        title: 'Boeuf Bourguignon',
        slots: ['dinner'],
        category: 'main',
        origin: 'France',
        youtube: 'https://youtube.com/shorts/7Tu00snhYGQ?si=3CcHQjqQQpNGZwXz',
        image:
            'https://i.pinimg.com/736x/e5/42/40/e5424041754f4e33471f7bad7b284a7e.jpg',
        images: [
            'https://i.pinimg.com/1200x/3c/71/69/3c7169f074a72c5be8734b896a47cf66.jpg',
            'https://i.pinimg.com/736x/fb/00/f7/fb00f77a0cc0d0e8cffedc79bdccb034.jpg',
            'https://i.pinimg.com/736x/2e/fe/07/2efe0798c1b997872ea9d270ce2d5bbc.jpg',
        ],
    },
    {
        id: 'kimchi-jjigae',
        title: 'Kimchi Jjigae',
        slots: ['lunch', 'dinner'],
        category: 'soup',
        origin: 'Korea',
        youtube: 'https://youtube.com/shorts/cwm59bZXCuQ?si=BVHrznrzpreMNbnq',
        image:
            'https://i.pinimg.com/1200x/0c/9d/27/0c9d27934818d12fa22c3f4338561f67.jpg',
        images: [
            'https://i.pinimg.com/1200x/4a/44/67/4a44674f6ae3db0880819d5d72702894.jpg',
            'https://i.pinimg.com/1200x/71/3c/c9/713cc92d12b194319fbbb58d1e6498ef.jpg',
            'https://i.pinimg.com/736x/56/8b/bd/568bbd8718084465a9b90b4d37ee32e5.jpg',
        ],
    },
    {
        id: 'gazpacho',
        title: 'Spanish Gazpacho',
        slots: ['lunch'],
        category: 'soup',
        origin: 'Spain',
        youtube: 'https://youtu.be/pXBPKXm4T1U?si=Zvqw5YVmFshUKCIj',
        image:
            'https://i.pinimg.com/1200x/75/7e/06/757e06879f628b0c5d6e4eea52a2ac4f.jpg',
        images: [
            'https://i.pinimg.com/736x/d2/89/f3/d289f3a6ecd6f58795f14085b2cf8d87.jpg',
            'https://i.pinimg.com/736x/02/7a/2c/027a2c048237fc7ece7d0427a69b4f2d.jpg',
            'https://i.pinimg.com/736x/59/7f/f8/597ff8cbe9f0e884971c6864d6b1650d.jpg',
        ],
    },
    {
        id: 'moussaka',
        title: 'Greek Moussaka',
        slots: ['lunch', 'dinner'],
        category: 'main',
        origin: 'Greece',
        youtube: 'https://youtu.be/cSR9GLO3Bl4?si=jLnYssWippBiB2Zo',
        image:
            'https://i.pinimg.com/1200x/eb/ed/29/ebed29ea346cac7efaa633c515601614.jpg',
        images: [
            'https://i.pinimg.com/1200x/a3/87/76/a387760532127d8215c2f5c1c16a231d.jpg',
            'https://i.pinimg.com/1200x/85/4a/7b/854a7b26b74c1d11d55905343bbefa1f.jpg',
            'https://i.pinimg.com/736x/c0/55/09/c05509518bf56896a189cbd9b3580afc.jpg',
        ],
    },
    {
        id: 'feijoada',
        title: 'Feijoada',
        slots: ['lunch'],
        category: 'main',
        origin: 'Brazil',
        youtube: 'https://youtube.com/shorts/nhQJ1w54yCE?si=Kjq1kvIls67YITdL',
        image:
            'https://i.pinimg.com/1200x/45/a0/e3/45a0e3a6fc7022e74e6a11c0ebdaacfc.jpg',
        images: [
            'https://i.pinimg.com/1200x/b9/d5/1c/b9d51c82f2370ae41824872604d54aa8.jpg',
            'https://i.pinimg.com/736x/50/53/ea/5053ea84d473e6ae74b097285ea97113.jpg',
            'https://i.pinimg.com/1200x/d4/23/ce/d423ce6d43e39a6fdcb3514fec6a2b59.jpg',
        ],
    },

    // ===== SNACKS / LIGHT DISHES =====
    {
        id: 'takoyaki',
        title: 'Takoyaki',
        slots: ['snack', 'dinner'],
        category: 'snack',
        origin: 'Japan',
        youtube: 'https://youtube.com/shorts/pTrbP1q6HLM?si=BWqGklVjq4QINjKz',
        image:
            'https://i.pinimg.com/736x/fe/58/0c/fe580c83a433505a674e19b1a835ab2b.jpg',
        images: [
            'https://i.pinimg.com/736x/ab/82/0b/ab820b8780f063a9649b315eae2d9557.jpg',
            'https://i.pinimg.com/1200x/3d/ad/e7/3dade7eff8a5bfd6aff4463020b34d1e.jpg',
            'https://i.pinimg.com/1200x/e2/34/20/e23420e12d6f233dfd3987857887ed0e.jpg',
        ],
    },
    {
        id: 'tteokbokki',
        title: 'Tteokbokki',
        slots: ['snack'],
        category: 'snack',
        origin: 'Korea',
        youtube: 'https://youtube.com/shorts/n2UrPDt4ARU?si=8LR8IPMP2TrN2o6N',
        image:
            'https://i.pinimg.com/1200x/f9/9a/2b/f99a2b22380e9fc8fa35fc82039e91ca.jpg',
        images: [
            'https://i.pinimg.com/1200x/ca/a1/2a/caa12ac72049ad2e8225bc5782be2dc0.jpg',
            'https://i.pinimg.com/736x/57/92/62/579262e715eae475ac6390e9689bb6e2.jpg',
            'https://i.pinimg.com/736x/33/af/b7/33afb7a0b1941a8c7d668602e42f2ba4.jpg',
        ],
    },
    {
        id: 'croissant',
        title: 'Croissant',
        slots: ['snack', 'breakfast'],
        category: 'dessert',
        origin: 'France',
        youtube: 'https://youtube.com/shorts/gPibdR4GtDI?si=C2F1ArqGdqs-r6fC',
        image:
            'https://i.pinimg.com/736x/d6/62/31/d66231e233a7c5c5fba17e2a6651e411.jpg',
        images: [
            'https://i.pinimg.com/736x/7b/3e/ec/7b3eec464fbc508deda2d3044cf157ae.jpg',
            'https://i.pinimg.com/736x/fd/39/66/fd3966ba54cb69f31dd8b9a98d972a31.jpg',
            'https://i.pinimg.com/736x/f1/04/6a/f1046ab7616cf1c77ffe6ab756c98075.jpg',
        ],
    },
    {
        id: 'donuts',
        title: 'Donuts',
        slots: ['snack'],
        category: 'dessert',
        origin: 'Western',
        youtube: 'https://youtube.com/shorts/vJRuI0t99RM?si=NsoniRpiSf200wSE',
        image:
            'https://i.pinimg.com/736x/be/97/d3/be97d3df89865131adbc0f1ede9869bc.jpg',
        images: [
            'https://i.pinimg.com/736x/8a/c8/c9/8ac8c99f8c500a62d7959bbb2054244d.jpg',
            'https://i.pinimg.com/1200x/0b/2d/91/0b2d91cec989debe37ee5ec2032d5e42.jpg',
            'https://i.pinimg.com/736x/80/0e/fb/800efb75788862cdf6b1570fbf5a4336.jpg',
        ],
    },
    {
        id: 'onigiri',
        title: 'Onigiri',
        slots: ['breakfast', 'lunch', 'snack'],
        category: 'snack',
        origin: 'Japan',
        youtube: 'https://youtube.com/shorts/bgZr8xry5y4?si=c0evUmhoOfcg1f7-',
        image:
            'https://i.pinimg.com/1200x/0d/32/48/0d32482931d8bb1ec2a331449f82c7eb.jpg',
        images: [
            'https://i.pinimg.com/1200x/e9/74/4b/e9744b267fc707ed326aa01c659cc8b6.jpg',
            'https://i.pinimg.com/1200x/0a/a6/d5/0aa6d5a1332ba3f8168af8c627ac20a9.jpg',
            'https://i.pinimg.com/736x/35/89/98/3589981c5cafb34826a1c5d09e923f36.jpg',
        ],
    },
    {
        id: 'banh-xeo',
        title: 'Bánh Xèo',
        slots: ['lunch', 'dinner'],
        category: 'main',
        origin: 'Vietnam',
        youtube: 'https://youtube.com/shorts/BPgG4Fi8aPA?si=rH5n7Ijola12xkTl',
        image:
            'https://i.pinimg.com/736x/33/6b/65/336b656f607efabfafc9cf8b0276cd53.jpg',
        images: [
            'https://i.pinimg.com/736x/f8/10/79/f81079e33da83580d997389229dbb62d.jpg',
            'https://i.pinimg.com/1200x/f8/10/79/f81079e33da83580d997389229dbb62d.jpg',
            'https://i.pinimg.com/736x/08/34/0d/08340de9a9daec33d3122982b39f4254.jpg',
        ],
    },
    {
        id: 'curry-puff',
        title: 'Curry Puff',
        slots: ['snack', 'breakfast'],
        category: 'snack',
        origin: 'Southeast Asia',
        youtube: 'https://youtube.com/shorts/CM_5x0M-sPk?si=KX_ogdRHkVYXJ2SC',
        image:
            'https://i.pinimg.com/1200x/2a/ec/30/2aec300e809c733a3bdbcaae3b495fcb.jpg',
        images: [
            'https://i.pinimg.com/736x/d4/bc/12/d4bc125a04ac8aa0e1e83c1cf32fd105.jpg',
            'https://i.pinimg.com/736x/17/4b/e7/174be785d837c0fa5674d559a27fde9d.jpg',
            'https://i.pinimg.com/736x/ca/21/d4/ca21d437655bd471032b3dc67d1dbb42.jpg',
        ],
    },
    {
        id: 'hummus-msabbaha',
        title: 'Hummus Msabbaha',
        slots: ['breakfast', 'lunch'],
        category: 'snack',
        origin: 'Middle East',
        youtube: 'https://youtube.com/shorts/AcunwYKGbtk?si=kPun3AgVfscfrFH6',
        image:
            'https://i.pinimg.com/736x/34/91/d1/3491d149a865324058b441a677440bbc.jpg',
        images: [
            'https://i.pinimg.com/736x/c6/cf/80/c6cf80e10614b87f9822a195ed45fdd7.jpg',
            'https://i.pinimg.com/1200x/9b/cd/0e/9bcd0e3cfa9552c7d9193a5a70fe25ea.jpg',
            'https://i.pinimg.com/1200x/a7/c1/54/a7c154b80a86459aa3a11a5bb4ce53d4.jpg',
        ],
    },
    {
        id: 'crepes',
        title: 'French Crêpes',
        slots: ['dessert', 'snack'].includes('dessert')
            ? (['snack'] as MealSlot[])
            : ['snack'],
        // trick nhỏ vì type, nhưng cơ bản cứ coi là snack/dessert
        category: 'dessert',
        origin: 'France',
        youtube: 'https://youtube.com/shorts/KRVk1YYyNxU?si=bOGy89GrTwifoM1f',
        image:
            'https://i.pinimg.com/736x/b7/9c/1d/b79c1d8a281d49ead9af1a6f1d63c65f.jpg',
        images: [
            'https://i.pinimg.com/736x/80/9b/54/809b54074ee5cd4ca5948f983bd93678.jpg',
            'https://i.pinimg.com/736x/3a/96/2e/3a962e1d5a64aaf5c309cfeb62bdd9ae.jpg',
            'https://i.pinimg.com/736x/21/0e/51/210e51ae3750597bdab806c068331c8a.jpg',
        ],
    },

    // ===== SALAD =====
    {
        id: 'cobb-salad',
        title: 'Cobb Salad',
        slots: ['any'],
        category: 'salad',
        origin: 'USA',
        youtube: 'https://youtu.be/4ZQhZADjFOk?si=k_34bRjuB0-5EoAW',
        image:
            'https://i.pinimg.com/1200x/60/11/ac/6011ac5895bdaaed1afb198c5ad6a619.jpg',
        images: [
            'https://i.pinimg.com/736x/ca/19/99/ca19991ba62f88abf6669bfd0291776a.jpg',
            'https://i.pinimg.com/1200x/cf/7b/08/cf7b08c7de57d195d562fb1c3f7ea581.jpg',
        ],
    },

    // ===== DRINKS =====
    {
        id: 'boba-milk-tea',
        title: 'Boba Milk Tea',
        slots: ['snack', 'any'],
        category: 'drink',
        origin: 'Taiwan',
        youtube: 'https://youtu.be/HVvo6npKxKw?si=RYWtpw0_j89WvLBJ',
        image:
            'https://i.pinimg.com/736x/2a/05/31/2a0531704dab4e69a88c1967fe7fb94b.jpg',
        images: [
            'https://i.pinimg.com/736x/e8/db/21/e8db214a504a125a6ab7b618e61cfb70.jpg',
            'https://i.pinimg.com/736x/51/e6/b0/51e6b0f42c4c619a8f32d97a23344db4.jpg',
        ],
    },
    {
        id: 'thai-iced-tea',
        title: 'Thai Iced Tea',
        slots: ['any'],
        category: 'drink',
        origin: 'Thailand',
        youtube: 'https://youtu.be/IabhqGI1q1M?si=kKhK1VnWtTkFF68D',
        image:
            'https://i.pinimg.com/736x/52/6b/a9/526ba9a4011242d294107a19a2c53c86.jpg',
        images: [
            'https://i.pinimg.com/1200x/f7/ca/d4/f7cad436d4978c8851fe6f076aed72fe.jpg',
            'https://i.pinimg.com/736x/00/0f/d6/000fd68b8f8e3dad0f1d4906b55449a5.jpg',
            'https://i.pinimg.com/736x/02/d1/d6/02d1d6da1ffce53e5db5dae7d5e8c6f7.jpg',
        ],
    },
    {
        id: 'yuja-cha',
        title: 'Yuja-cha (Citron Tea)',
        slots: ['any'],
        category: 'drink',
        origin: 'Korea',
        youtube: 'https://youtube.com/shorts/zhC-E3OyZiI?si=pKXVTN0tI2_6Ddar',
        image:
            'https://i.pinimg.com/736x/8c/a2/e6/8ca2e61da30bc1a89aadb058667fc850.jpg',
        images: [
            'https://i.pinimg.com/736x/84/42/97/8442973114e1038f7ec83a21b3a60ee7.jpg',
            'https://i.pinimg.com/736x/0d/ca/58/0dca584c5ba9fbb09cac129d45465237.jpg',
            'https://i.pinimg.com/736x/c5/0e/83/c50e8398f40c276471b075f6ae7950b8.jpg',
        ],
    },
    {
        id: 'makgeolli',
        title: 'Makgeolli',
        slots: ['any'],
        category: 'alcohol',
        origin: 'Korea',
        youtube: 'https://youtube.com/shorts/2I1wZGyWwno?si=85Ua8vxBhP222YKd',
        image:
            'https://i.pinimg.com/736x/eb/77/e0/eb77e06df375e1da36f16c5308778000.jpg',
        images: [
            'https://i.pinimg.com/736x/76/f1/e6/76f1e621a6d9e94078d14e32f9b9a5d4.jpg',
            'https://i.pinimg.com/736x/bf/a4/f8/bfa4f800a6f416ab6b5d2c174cdb3b3f.jpg',
            'https://i.pinimg.com/736x/df/e1/98/dfe19839c9a74b5dd06126d0b3bfb53f.jpg',
        ],
    },
    {
        id: 'gin-tonic',
        title: 'Gin & Tonic',
        slots: ['any'],
        category: 'alcohol',
        origin: 'UK',
        youtube: 'https://youtube.com/shorts/H-_cfNUjBjc?si=hZ6sSZiwXqJy4o7t',
        image:
            'https://i.pinimg.com/1200x/c2/a4/76/c2a476f771885065dd701bac0cd50e31.jpg',
        images: [
            'https://i.pinimg.com/736x/da/04/a4/da04a4b86696129b1085961ddeb06291.jpg',
            'https://i.pinimg.com/736x/ec/d3/07/ecd3078933fd2fe28157e0e40dad3aad.jpg',
            'https://i.pinimg.com/1200x/ec/d3/07/ecd3078933fd2fe28157e0e40dad3aad.jpg',
        ],
    },

    // ===== BREAKFAST =====
    {
        id: 'patongo',
        title: 'Thai Patongo',
        slots: ['breakfast'],
        category: 'breakfast',
        origin: 'Thailand',
        youtube: 'https://youtu.be/NyGQvI6-fPs?si=58_nBESjFiBFSAmo',
        image:
            'https://i.pinimg.com/1200x/46/e7/24/46e72404c39129b674ddc85c6f9d37b9.jpg',
        images: [
            'https://i.pinimg.com/736x/f8/eb/8d/f8eb8dc7c07ceb0ade7abbd77454c23f.jpg',
            'https://i.pinimg.com/736x/2f/34/ea/2f34ea334f7f8454143af01e1b742d6c.jpg',
            'https://i.pinimg.com/736x/2d/50/ba/2d50babc2964e07c34ad7952f3c3a5f4.jpg',
        ],
    },
    {
        id: 'avocado-toast',
        title: 'Avocado Toast',
        slots: ['breakfast'],
        category: 'breakfast',
        origin: 'Western',
        youtube: 'https://youtube.com/shorts/ymg3Y2d5C-4?si=T9pM-stCTBEy6HjQ',
        image:
            'https://i.pinimg.com/1200x/2b/c5/4a/2bc54ab609fc9d71785c17a39fb2587e.jpg',
        images: [
            'https://i.pinimg.com/736x/bf/87/86/bf878667704dbc2e40f3e9cb1fe67aa4.jpg',
            'https://i.pinimg.com/736x/70/8d/e6/708de62cf1553c55b9ab511087438677.jpg',
            'https://i.pinimg.com/736x/ca/72/06/ca720680a77763d623ad92011696afb0.jpg',
        ],
    },
    {
        id: 'kimbap',
        title: 'Kimbap',
        slots: ['breakfast'],
        category: 'breakfast',
        origin: 'Korea',
        youtube: 'https://youtube.com/shorts/ILE3lFbACCM?si=NwUO7CAnIcYMVrc5',
        image:
            'https://i.pinimg.com/736x/14/46/cd/1446cd1b116be5c5bfc7218a2a478ba4.jpg',
        images: [
            'https://i.pinimg.com/1200x/c5/e6/fe/c5e6fe3bff01b50f90f17d89d42a772d.jpg',
            'https://i.pinimg.com/1200x/0d/57/5c/0d575ce3e9010b9e34e88c252cde0089.jpg',
            'https://i.pinimg.com/736x/e0/c3/33/e0c3336f1ed8e7f5cb06f97dcc19df83.jpg',
        ],
    },
    {
        id: 'bagel-breakfast',
        title: 'Breakfast Bagel Sandwich',
        slots: ['breakfast'],
        category: 'breakfast',
        origin: 'Western',
        youtube: 'https://youtube.com/shorts/LzvM8SgC3JU?si=49kI_Nm8WQ6HqlKh',
        image:
            'https://i.pinimg.com/1200x/72/99/57/72995787c0d44431029591fd0923837f.jpg',
        images: [
            'https://i.pinimg.com/736x/35/89/cc/3589cc39bfa7048ff7ee0043e7f3bf0d.jpg',
            'https://i.pinimg.com/1200x/7f/8a/68/7f8a68882ca8b05afb9ac8b59367dfe0.jpg',
            'https://i.pinimg.com/736x/a5/ea/12/a5ea1219f8f79bf2495615df710a5fbe.jpg',
        ],
    },
    {
        id: 'full-english',
        title: 'Full English Breakfast',
        slots: ['breakfast'],
        category: 'breakfast',
        origin: 'UK',
        youtube: 'https://youtube.com/shorts/Wo0smJajSuM?si=i6U1BsOwUUpfbCXa',
        image:
            'https://i.pinimg.com/1200x/30/2e/96/302e96b567dd2fc9924dbd9c29a83c0c.jpg',
        images: [
            'https://i.pinimg.com/1200x/8a/1f/14/8a1f1422ac6e28bf4605fb988c43dd23.jpg',
            'https://i.pinimg.com/736x/4a/4e/93/4a4e938ef2933b863454256d4a131ead.jpg',
            'https://i.pinimg.com/736x/e8/23/87/e82387d8d43bb934f938f9a9a0d0f439.jpg',
        ],
    },
    {
        id: 'dimsum-har-gow',
        title: 'Shrimp Dumplings (Har Gow)',
        slots: ['breakfast'],
        category: 'breakfast',
        origin: 'China',
        youtube: 'https://youtube.com/shorts/YUeI6MtxYCw?si=qJVbyoTp2vMyEu7I',
        image:
            'https://i.pinimg.com/736x/28/89/05/28890508f85882917bcc4de048a5993e.jpg',
        images: [
            'https://i.pinimg.com/736x/2d/5f/49/2d5f490af4fa616195df56c03f78b5bf.jpg',
            'https://i.pinimg.com/736x/f2/53/0b/f2530b471c0aa1473908f4d715bf4de1.jpg',
            'https://i.pinimg.com/736x/07/54/6d/07546dff609b0d06a4cdade50eccc09e.jpg',
        ],
    },
];
