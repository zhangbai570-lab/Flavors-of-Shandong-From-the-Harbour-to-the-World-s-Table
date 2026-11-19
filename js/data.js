/* 海味山东 · 内容数据
 * 所有可替换的文字都在这里；HTML/CSS/main.js 不需要动。
 * 每个字段以 {zh, en, ja, ko} 提供四语种；修改时请四种语言一起改。
 */
window.SITE = {

  /* ---------- 壹 · 四个港口 ---------- */
  cities: [
    {
      id: "qingdao",
      no: "01",
      x: 525, y: 286, labelDx: 20, labelDy: 8, labelAnchor: "start",
      name: { zh: "青岛", en: "Qingdao", ja: "青島", ko: "칭다오" },
      en: "QINGDAO",
      region: { zh: "胶州湾", en: "JIAOZHOU BAY", ja: "膠州湾", ko: "자오저우만" },
  climate: {
    zh: "温带季风气候，三面环海。夏天不闷热，冬天不算冷，春夏海上多雾。",
    en: "Temperate monsoon, sea on three sides: mild summers, cool winters, and foggy springs.",
    ja: "温帯モンスーン気候。三方を海に囲まれ、夏は蒸し暑くならず冬も穏やか。春から夏は海霧が多い。",
    ko: "온대 몬순 기후. 삼면이 바다로 둘러싸여 여름은 덥지 않고 겨울은 온화하며, 봄에는 해무가 잦습니다."
  },
  customs: {
    zh: "夏天散啤装进塑料袋，退潮时赶海挖蛤蜊，八月有啤酒节。",
    en: "Draught beer in plastic bags in summer, clam-digging on the ebb tide, and a beer festival in August.",
    ja: "夏はビニール袋の生ビール、干潮時の潮干狩り、8月のビール祭り。",
    ko: "여름엔 비닐봉지 생맥주, 썰물 때 바지락 캐기, 8월 맥주 축제."
  },
      dish: { zh: "辣炒蛤蜊", en: "Spicy Stir-fried Clams", ja: "アサリの辛炒め", ko: "바지락 볶음" },
      pinyin: "là chǎo gé lí",
      dialect: { zh: "青岛话叫「嘎啦」", en: "in the local dialect: gá la", ja: "青島方言では「嘎啦」", ko: "칭다오 방언으로 '嘎啦'" },
      story: {
        zh: "夏夜的青岛，散啤装在塑料袋里，辣炒嘎啦装在铁盘里。蛤蜊在胶东话里叫「嘎啦」，两个音节，像壳与壳相碰。英语 clam 来自古英语，本义是「夹紧、扣住」——蛤蜊合上壳，确实像一把小锁。",
        en: "On a summer night in Qingdao, draught beer comes in a plastic bag and spicy clams in an iron pan. In the Jiaodong dialect a clam is 'gá la' — a sound like two shells knocking. English 'clam' comes from Old English, where it meant 'to clamp or grip': a closed clam is, quite literally, a small lock.",
        ja: "夏の夜の青島では、生ビールはビニール袋に、アサリは鉄板に。膠東方言ではアサリを「嘎啦」と呼び、貝がぶつかる音のようです。英語の clam は古英語で「締めつける」を意味しました。",
        ko: "여름밤 칭다오에서는 생맥주를 비닐봉지에, 바지락 볶음을 철판에 담아 냅니다. 자오둥 방언으로 바지락은 '嘎啦'인데, 껍데기가 부딪는 소리와 닮았습니다. 영어 clam은 고대 영어에서 '꽉 집다'라는 뜻이었습니다."
      },
      forms: [
        { key: "zh", word: "蛤蜊 · 青岛话「嘎啦」" },
        { key: "en", word: "clam" },
        { key: "ja", word: "アサリ" },
        { key: "ko", word: "바지락" }
      ],
      note: {
        zh: "美式的蛤蜊浓汤 clam chowder 用奶油，青岛人用辣椒和啤酒回答同一片海。",
        en: "New England answers the same sea with cream; Qingdao answers with chilli and beer.",
        ja: "アメリカ東海岸はクリームで、青島は唐辛子とビールで、同じ海に答えます。",
        ko: "미국 동부는 크림으로, 칭다오는 고추와 맥주로 같은 바다에 답합니다."
      }
    },
    {
      id: "yantai",
      no: "02",
      x: 619, y: 120, labelDx: 0, labelDy: -26, labelAnchor: "middle",
      name: { zh: "烟台", en: "Yantai", ja: "煙台", ko: "옌타이" },
      en: "YANTAI",
      region: { zh: "鲁菜 · 蓬莱", en: "LU CUISINE · PENGLAI", ja: "魯菜 · 蓬莱", ko: "루차이 · 펑라이" },
  climate: {
    zh: "温带季风，冬春多雪，是有名的「雪窝」；夏天凉爽，苹果和樱桃长得好。",
    en: "Temperate monsoon: heavy winter snow earns it the name 'snow nest', while cool summers suit apples and cherries.",
    ja: "温帯モンスーン。冬から春は雪が多く「雪の巣」と呼ばれ、夏は涼しくリンゴやサクランボが育ちます。",
    ko: "온대 몬순. 겨울과 봄에 눈이 많아 '눈의 둥지'라 불리며, 여름은 서늘해 사과와 체리가 잘 자랍니다."
  },
  customs: {
    zh: "开海后第一网先祭海；渔灯节放灯；鲁菜讲究「鲜咸」。",
    en: "The first catch after the fishing ban is offered in a sea rite; lanterns at the fishing-lamp festival; Lu cuisine's fresh-and-salty style.",
    ja: "禁漁明けの初網は海神に供え、漁灯祭りでは灯りを流します。魯菜は「鮮鹹」が身上。",
    ko: "금어기 후 첫 조업은 해신제로 바치고, 어등 축제에는 등불을 띄웁니다. 루차이는 '신선하고 짭짤한' 맛이 특징입니다."
  },
      dish: { zh: "葱烧海参", en: "Braised Sea Cucumber with Scallions", ja: "ナマコの葱炒め", ko: "해삼 파볶음" },
      pinyin: "cōng shāo hǎi shēn",
      dialect: { zh: "鲁菜头牌", en: "a signature of Lu cuisine", ja: "魯菜の看板", ko: "루차이의 대표 요리" },
      story: {
        zh: "葱烧海参是鲁菜的招牌。中国人把海参看作「海中人参」，日本人写作「海鼠」——海里的老鼠，英国人叫它 sea cucumber，海里的黄瓜。同一只海参，在三种语言里变成了药材、老鼠和蔬菜。命名的差异，其实是三种看世界的方式。",
        en: "Braised sea cucumber with scallions is a signature of Lu cuisine. Chinese calls it 'ginseng of the sea'; Japanese writes it 海鼠, 'sea rat'; English calls it a 'sea cucumber'. One creature becomes a medicine, a rodent and a vegetable — three languages, three ways of seeing.",
        ja: "ナマコは漢字で「海鼠」と書きます。中国語では「海の人参」、英語では「海のきゅうり」。同じ生き物が、薬にも、鼠にも、野菜にも見えるのです。",
        ko: "해삼은 중국어로 '바다의 인삼', 일본어로 '바다의 쥐(海鼠)', 영어로 '바다의 오이'입니다. 같은 생물이 언어마다 약이 되고, 쥐가 되고, 채소가 됩니다."
      },
      forms: [
        { key: "zh", word: "海参 hǎi shēn" },
        { key: "en", word: "sea cucumber" },
        { key: "ja", word: "ナマコ（海鼠）" },
        { key: "ko", word: "해삼" }
      ],
      note: {
        zh: "「葱烧」用大葱的甜把海参的鲜吊出来；在日本，海参的肠子被腌成「このわた」，是另一种珍味。",
        en: "Scallions draw out the umami; in Japan the intestines are salted into konowata, another delicacy.",
        ja: "長ねぎの甘みで旨みを引き出します。日本では腸を塩漬けにした「このわた」も珍味です。",
        ko: "대파의 단맛으로 감칠맛을 끌어냅니다. 일본에서는 창자를 절인 '고노와타'도 별미입니다."
      }
    },
    {
      id: "weihai",
      no: "03",
      x: 685, y: 123, labelDx: -14, labelDy: 18, labelAnchor: "end",
      name: { zh: "威海", en: "Weihai", ja: "威海", ko: "웨이하이" },
      en: "WEIHAI",
      region: { zh: "胶东 · 家常", en: "JIAODONG · HOME TABLE", ja: "膠東 · 家庭", ko: "자오둥 · 집밥" },
  climate: {
    zh: "海洋性季风，冬暖夏凉，海风大；沿海常见海草屋顶的老屋。",
    en: "Maritime monsoon: mild winters, cool summers, strong sea winds; old cottages with seaweed-thatch roofs line the coast.",
    ja: "海洋性モンスーン。冬は暖かく夏は涼しく風が強い。海岸には海藻屋根の古い家が残ります。",
    ko: "해양성 몬순. 겨울은 따뜻하고 여름은 서늘하며 바람이 강합니다. 해안에는 해초 지붕 집이 남아 있습니다."
  },
  customs: {
    zh: "渔村祭海；春天把最新鲜的鲅鱼饺子送去丈人家；住海草房。",
    en: "Sea rites in fishing villages; in spring, the freshest mackerel dumplings go to one's father-in-law; seaweed-thatch houses.",
    ja: "漁村の海神祭。春には一番新鮮なサワラ水餃子を義父の家へ。海藻屋根の家。",
    ko: "어촌 해신제. 봄에는 가장 신선한 삼치 만두를 장인 댁에 드립니다. 해초 지붕 집."
  },
      dish: { zh: "鲅鱼水饺", en: "Mackerel Dumplings", ja: "サワラ水餃子", ko: "삼치 물만두" },
      pinyin: "bà yú shuǐ jiǎo",
      dialect: { zh: "「鲅鱼跳，丈人笑」", en: "'when the mackerel jumps, the father-in-law smiles'", ja: "「サワラが跳ねれば義父が笑う」", ko: "'삼치가 뛰면 장인이 웃는다'" },
      story: {
        zh: "胶东有句老话：「鲅鱼跳，丈人笑。」春天鲅鱼上市，女婿要提一条最新鲜的去看岳父。鲅鱼在英语里叫 Japanese Spanish mackerel——一个被分类学写坏了的名字：它既不是西班牙的，也不只属于日本。日语的サワラ、韩语的삼치，才是这片海里更近的亲戚。",
        en: "In Jiaodong they say: 'When the mackerel jumps, the father-in-law smiles.' In spring a son-in-law brings the freshest fish to his wife's parents. English calls it 'Japanese Spanish mackerel' — a name taxonomy made a mess of: it is neither Spanish nor only Japanese. The Japanese sawara and Korean samchi are closer relatives.",
        ja: "膠東には「サワラが跳ねれば、義父が笑う」という言葉があります。春、婿は一番新鮮な魚を義父母に届けます。英語名は Japanese Spanish mackerel。スペインの魚でも、日本だけの魚でもありません。",
        ko: "자오둥에는 '삼치가 뛰면 장인이 웃는다'는 말이 있습니다. 봄이면 사위가 가장 신선한 삼치를 장인댁에 갖다 드립니다. 영어 이름은 Japanese Spanish mackerel이지만, 스페인 바다의 물고기도 일본만의 물고기도 아닙니다."
      },
      forms: [
        { key: "zh", word: "鲅鱼 bà yú" },
        { key: "en", word: "Japanese Spanish mackerel" },
        { key: "ja", word: "サワラ（鰆）" },
        { key: "ko", word: "삼치" }
      ],
      note: {
        zh: "饺子出海也会改名：日语写作「ギョーザ」，借自汉语；韩语的「만두」却来自「馒头」。一个词出去，回来时已经变了模样。",
        en: "The dumpling changes name abroad: Japanese gyoza borrows from Chinese, while Korean mandu descends from mantou, 'steamed bun'. A word leaves home and returns changed.",
        ja: "餃子は海を渡って姿を変えます。日本語の「ギョーザ」は中国語から、韓国語の「만두」は「饅頭」から来ました。",
        ko: "만두는 중국어 '만터우(饅頭)'에서 왔고, 일본어 '교자(ギョーザ)'는 '자오쯔(餃子)'에서 왔습니다. 말은 바다를 건너며 모습을 바꿉니다."
      }
    },
    {
      id: "rizhao",
      no: "04",
      x: 443, y: 359, labelDx: 0, labelDy: 30, labelAnchor: "middle",
      name: { zh: "日照", en: "Rizhao", ja: "日照", ko: "르자오" },
      en: "RIZHAO",
      region: { zh: "日照 · 渔家", en: "RIZHAO · FISHERMAN", ja: "日照 · 漁家", ko: "르자오 · 어부" },
  climate: {
    zh: "暖温带季风，四季分明，日照充足——城市名字就是这么来的。",
    en: "Warm-temperate monsoon with four clear seasons and plenty of sunshine — the very source of its name.",
    ja: "暖温帯モンスーン。四季がはっきりし日照が多いことが、地名の由来です。",
    ko: "난온대 몬순. 사계절이 뚜렷하고 일조량이 많아 지명의 유래가 되었습니다."
  },
  customs: {
    zh: "赶海节挖蛤蜊；渔民号子；黑陶与海盐是老手艺。",
    en: "Clam-digging at the tidal-flat festival, fishermen's work songs, and the old crafts of black pottery and sea salt.",
    ja: "潮干狩り祭り、漁師の労働歌、黒陶と海塩の古い技。",
    ko: "갯벌 축제에서 바지락 캐기, 어부의 노동요, 흑도자기와 천일염의 오랜 기술."
  },
      dish: { zh: "海鲜疙瘩汤", en: "Seafood Dough-Drop Soup", ja: "海鮮すいとん", ko: "해산물 수제비" },
      pinyin: "hǎi xiān gē da tāng",
      dialect: { zh: "疙瘩：最难译的一个词", en: "'gēda': the hardest word to translate", ja: "「疙瘩」：最も訳しにくい言葉", ko: "'거다(疙瘩)': 가장 번역하기 어려운 말" },
      story: {
        zh: "「疙瘩」是这道菜最难翻译的词。英语把它译成 dough drop——面团的滴落；日语找到自己的「すいとん」，韩语用「수제비」。三个词都指向同一个动作：把面糊一点点拨进滚开的水里。翻译家常说，最难译的不是术语，是「家常」。",
        en: "'Gēda' is the hardest word in this dish to translate. English renders it 'dough drop'; Japanese finds its own suiton; Korean uses sujebi. All three point to one gesture: flicking batter, bit by bit, into boiling water. Translators like to say the hardest thing to translate is not terminology — it is homeliness.",
        ja: "「疙瘩」はこの料理で最も訳しにくい言葉です。英語は dough drop、日本語は「すいとん」、韓国語は「수제비」。三つとも、生地を少しずつ熱湯に落とす同じ動作を指します。翻訳で難しいのは専門用語ではなく「家庭の味」だと言われます。",
        ko: "'거다(疙瘩)'는 이 요리에서 가장 번역하기 어려운 말입니다. 영어는 dough drop, 일본어는 '스이톤', 한국어는 '수제비'를 찾아냈습니다. 세 말 모두 반죽을 조금씩 끓는 물에 떨어뜨리는 같은 동작을 가리킵니다."
      },
      forms: [
        { key: "zh", word: "面疙瘩 miàn gē da" },
        { key: "en", word: "dough drop" },
        { key: "ja", word: "すいとん" },
        { key: "ko", word: "수제비" }
      ],
      note: {
        zh: "山东沿海人家往汤里加蛤蜊、虾皮、海虹，汤色一白，海味就上岸了。",
        en: "Coastal families add clams, dried shrimp and mussels; once the broth turns milky, the sea has come ashore.",
        ja: "蛤・干しエビ・ムール貝を加え、スープが白くなれば海の味が上陸します。",
        ko: "바지락, 마른 새우, 홍합을 넣어 국물이 뽀얗게 되면 바다가 육지에 오릅니다."
      }
    }
  ],

  /* ---------- 贰 · 词源卡片 ---------- */
  lexicon: [
    {
      id: "tea", no: "01", glyph: "茶", pinyin: "chá",
      word: { zh: "茶", en: "tea", ja: "茶", ko: "차" },
      forms: [
        { key: "zh", word: "茶 chá" },
        { key: "en", word: "tea" },
        { key: "nl", word: "thee" },
        { key: "ja", word: "茶（ちゃ）" },
        { key: "ko", word: "차" }
      ],
      story: {
        zh: "同一片叶子，走了两条海路。闽南语读 tê，荷兰商人把它带回欧洲，写成 thee，英语才有了 tea；粤语读 cha，葡萄牙人沿着另一条航线，把它写成 chá。今天英语里的 tea，其实是一句闽南话的远亲。",
        en: "One leaf, two sea routes. In Min Nan it was tê; Dutch traders carried it home as thee, and English took tea. Cantonese said cha, and the Portuguese wrote chá along another route. English 'tea' is a distant relative of a Min Nan word.",
        ja: "同じ葉が二つの海路をたどりました。閩南語の tê はオランダ商人を経て thee となり、英語の tea に。広東語の cha はポルトガル語の chá になりました。",
        ko: "같은 잎이 두 갈래 바닷길을 갔습니다. 민난어 tê는 네덜란드 상인을 거쳐 thee가 되었고, 광둥어 cha는 포르투갈어 chá가 되었습니다."
      }
    },
    {
      id: "haishen", no: "02", glyph: "参", pinyin: "hǎi shēn",
      word: { zh: "海参", en: "sea cucumber", ja: "ナマコ", ko: "해삼" },
      forms: [
        { key: "zh", word: "海参 hǎi shēn" },
        { key: "en", word: "sea cucumber" },
        { key: "ja", word: "ナマコ（海鼠）" },
        { key: "ko", word: "해삼" }
      ],
      story: {
        zh: "三双眼睛看同一只海参：中国人看见「海中人参」，日本人看见「海鼠」，英国人看见「海黄瓜」。翻译最难的地方，往往不是找不到词，而是找到了词，却换掉了看世界的角度。",
        en: "Three pairs of eyes on one sea cucumber: Chinese sees 'ginseng of the sea', Japanese sees a 'sea rat', English sees a 'sea cucumber'. The hardest part of translation is often not finding a word, but finding one that swaps the angle of vision.",
        ja: "同じナマコを、中国語は「海の人参」、日本語は「海鼠」、英語は「海のきゅうり」と呼びます。翻訳で難しいのは、言葉が見つからないことではなく、世界の見え方が入れ替わることです。",
        ko: "같은 해삼을 중국어는 '바다의 인삼', 일본어는 '바다의 쥐', 영어는 '바다의 오이'라 부릅니다. 번역이 어려운 까닭은 말을 못 찾는 것이 아니라, 세계를 보는 각도가 바뀌기 때문입니다."
      }
    },
    {
      id: "gala", no: "03", glyph: "蛤", pinyin: "gé lí",
      word: { zh: "蛤蜊", en: "clam", ja: "アサリ", ko: "바지락" },
      forms: [
        { key: "zh", word: "蛤蜊 · 青岛话「嘎啦」" },
        { key: "en", word: "clam" },
        { key: "ja", word: "アサリ" },
        { key: "ko", word: "바지락" }
      ],
      story: {
        zh: "蛤蜊在青岛话里是「嘎啦」，念出来像两片壳相碰；英语的 clam 来自古英语「夹紧」，说的是合壳的动作。德语把这类贝统称 Muschel，而 Herzmuschel（心蛤）是另一个科、因壳形像心而得名——并不是同一种蛤蜊。",
        en: "In Qingdao dialect a clam is 'gá la', which sounds like two shells knocking; English 'clam' comes from an Old English word for clamping shut — the action of closing. German calls shellfish in general Muschel; Herzmuschel ('heart shell') is a different family, named for its heart-shaped shell, not the same clam.",
        ja: "青島方言では「嘎啦」、貝がぶつかる音のようです。英語 clam は「締める」動作から。ドイツ語は貝類をまとめて Muschel と呼び、Herzmuschel（心臓形の貝）は別の科の貝で、同じ蛤ではありません。",
        ko: "칭다오 방언 '嘎啦'는 껍데기 부딪는 소리입니다. 영어 clam은 '집다'는 동작에서 왔습니다. 독일어는 조개류를 통칭 Muschel이라 하고, Herzmuschel(심장 모양 조개)은 다른 과의 조개로 같은 바지락이 아닙니다."
      }
    },
    {
      id: "kombu", no: "04", glyph: "昆", pinyin: "kūn bù",
      word: { zh: "昆布", en: "kombu", ja: "昆布", ko: "다시마" },
      forms: [
        { key: "zh", word: "昆布（海带）" },
        { key: "ja", word: "昆布 こんぶ" },
        { key: "en", word: "kombu" },
        { key: "ko", word: "다시마" }
      ],
      story: {
        zh: "昆布本是汉语里的古词，却在日语里长成了「こんぶ」，又在 19 世纪末以 kombu 的身份进入英语词典。山东荣成是全国最大的海带产区——词从海上来，也回到海上去。",
        en: "Kombu began as a classical Chinese word, grew into Japanese konbu, and entered English dictionaries as 'kombu' in the late 19th century. Rongcheng in Shandong is China's largest kelp-growing region: the word came from the sea and returned to it.",
        ja: "昆布はもともと漢語の古い言葉で、日本語の「こんぶ」になり、十九世紀末に kombu として英語辞書に入りました。山東省栄成は中国最大の昆布産地です。",
        ko: "곤포(昆布)는 본래 한자어였고, 일본어 '곤부'가 되었다가 19세기 말에 kombu로 영어 사전에 들어갔습니다. 산둥 룽청은 중국 최대 다시마 산지입니다."
      }
    },
    {
      id: "abalone", no: "05", glyph: "鲍", pinyin: "bào yú",
      word: { zh: "鲍鱼", en: "abalone", ja: "アワビ", ko: "전복" },
      forms: [
        { key: "zh", word: "鲍鱼 bào yú" },
        { key: "en", word: "abalone" },
        { key: "es", word: "abulón" },
        { key: "ja", word: "アワビ" },
        { key: "ko", word: "전복" }
      ],
      story: {
        zh: "英语 abalone 的旅行路线长得惊人：它借自西班牙语 abulón，而 abulón 又来自美国加州原住民语言 Rumsen（拉姆森语）的 aulón。一种山东人熟悉的海味，绕了半个地球，才在英语里落脚。",
        en: "English 'abalone' has travelled absurdly far: from Spanish abulón, which came from aulón in Rumsen, a Native Californian language. A seafood familiar on the Shandong coast took half the globe to land in English.",
        ja: "英語 abalone はスペイン語 abulón から、さらにカリフォルニア先住民のルムセン語 aulón にさかのぼります。山東の食卓でおなじみの海の幸が、地球の半周を回って英語にたどり着きました。",
        ko: "영어 abalone은 스페인어 abulón에서, 다시 캘리포니아 원주민 언어인 럼센어 aulón에서 왔습니다. 산둥에서 친숙한 해산물이 지구 반 바퀴를 돌아 영어에 닿았습니다."
      }
    },
    {
      id: "junk", no: "06", glyph: "帆", pinyin: "fān chuán",
      word: { zh: "帆船", en: "junk", ja: "ジャンク船", ko: "정크선" },
      forms: [
        { key: "zh", word: "帆船 fān chuán" },
        { key: "en", word: "junk" },
        { key: "pt", word: "junco" },
        { key: "ms", word: "jong" }
      ],
      story: {
        zh: "英语 junk 指中国帆船，来自葡萄牙语 junco，再往前是马来语/爪哇语的 jong。另一个 junk 意思是「破烂」，纯属同形不同源。词也会撞衫。",
        en: "English 'junk' for a Chinese sailing ship comes from Portuguese junco, from Malay/Javanese jong. The other 'junk', meaning rubbish, is a different word that merely looks alike. Words wear the same coat by accident.",
        ja: "中国の帆船を指す junk は、ポルトガル語 junco から、さらにマレー語・ジャワ語の jong へ。ゴミを意味する junk とは別の言葉です。",
        ko: "중국 범선을 뜻하는 junk는 포르투갈어 junco, 다시 말레이·자바어 jong에서 왔습니다. 쓰레기를 뜻하는 junk와는 다른 말입니다."
      }
    }
  ],

  /* ---------- 叁 · 宴席 ---------- */
  dishes: [
    {
      id: "haishen", icon: "cucumber", char: "参", pinyin: "cōng shāo hǎi shēn",
      names: { zh: "葱烧海参", en: "Braised Sea Cucumber", ja: "ナマコの葱炒め", ko: "해삼 파볶음" },
      tag: { zh: "鲁菜 · 烟台", en: "LU CUISINE · YANTAI", ja: "魯菜 · 煙台", ko: "루차이 · 옌타이" }
    },
    {
      id: "prawn", icon: "prawn", char: "虾", pinyin: "yóu mèn dà xiā",
      names: { zh: "油焖大虾", en: "Braised Prawns", ja: "大エビの醤油煮", ko: "새우 간장조림" },
      tag: { zh: "宴席 · 胶东", en: "BANQUET · JIAODONG", ja: "宴席 · 膠東", ko: "잔치 · 자오둥" }
    },
    {
      id: "dumpling", icon: "dumpling", char: "饺", pinyin: "bà yú shuǐ jiǎo",
      names: { zh: "鲅鱼水饺", en: "Mackerel Dumplings", ja: "サワラ水餃子", ko: "삼치 물만두" },
      tag: { zh: "家常 · 威海", en: "HOME TABLE · WEIHAI", ja: "家庭 · 威海", ko: "집밥 · 웨이하이" }
    },
    {
      id: "clam", icon: "clam", char: "蛤", pinyin: "là chǎo gé lí",
      names: { zh: "辣炒蛤蜊", en: "Spicy Stir-fried Clams", ja: "アサリの辛炒め", ko: "바지락 볶음" },
      tag: { zh: "夜市 · 青岛", en: "NIGHT MARKET · QINGDAO", ja: "夜市 · 青島", ko: "야시장 · 칭다오" }
    },
    {
      id: "jelly", icon: "jelly", char: "粉", pinyin: "hǎi liáng fěn",
      names: { zh: "海凉粉", en: "Seaweed Jelly", ja: "海藻ゼリー", ko: "우뭇가사리 묵" },
      tag: { zh: "夏日 · 胶东", en: "SUMMER · JIAODONG", ja: "夏 · 膠東", ko: "여름 · 자오둥" }
    },
    {
      id: "soup", icon: "soup", char: "汤", pinyin: "hǎi xiān gē da tāng",
      names: { zh: "海鲜疙瘩汤", en: "Seafood Dough-Drop Soup", ja: "海鮮すいとん", ko: "해산물 수제비" },
      tag: { zh: "渔家 · 日照", en: "FISHERMAN · RIZHAO", ja: "漁家 · 日照", ko: "어부 · 르자오" }
    },
    {
      id: "noodle", icon: "noodle", char: "面", pinyin: "péng lái xiǎo miàn",
      names: { zh: "蓬莱小面", en: "Penglai Noodles", ja: "蓬莱小麺", ko: "펑라이 소면" },
      tag: { zh: "早点 · 蓬莱", en: "BREAKFAST · PENGLAI", ja: "朝食 · 蓬莱", ko: "아침 · 펑라이" }
    },
    {
      id: "urchin", icon: "urchin", char: "胆", pinyin: "hǎi dǎn zhēng dàn",
      names: { zh: "海胆蒸蛋", en: "Steamed Sea Urchin Custard", ja: "ウニの茶碗蒸し", ko: "성게알 계란찜" },
      tag: { zh: "长岛 · 烟台", en: "CHANGDAO · YANTAI", ja: "長島 · 煙台", ko: "창다오 · 옌타이" }
    }
  ],

  /* ---------- 肆 · 工序 ---------- */
  craft: [
    {
      no: "01", icon: "fish",
      verb: { zh: "选", en: "choose", ja: "選ぶ", ko: "고르다" },
      title: { zh: "选鱼", en: "Choose the fish", ja: "魚を選ぶ", ko: "고르기" },
      desc: {
        zh: "春天的蓝点马鲛最肥，肉厚、刺少，鱼眼清亮。",
        en: "Spring Japanese Spanish mackerel is fattest: thick flesh, few bones, clear eyes.",
        ja: "春のサワラは最も脂がのり、身厚で骨が少ない。",
        ko: "봄 삼치는 가장 통통하고 살이 두툼하며 뼈가 적습니다."
      },
      meta: {
        zh: "春季 · 一条", en: "Spring · one fish", ja: "春 · 一尾", ko: "봄 · 한 마리"
      }
    },
    {
      no: "02", icon: "knife",
      verb: { zh: "刮", en: "scrape", ja: "こそげる", ko: "긁다" },
      title: { zh: "取肉", en: "Scrape the flesh", ja: "身をこそぐ", ko: "살 발라내기" },
      desc: {
        zh: "鱼皮朝下，刀背逆纹刮下白肉，小心避开细刺。",
        en: "Skin down, scrape the white flesh against the grain with the back of the knife, minding the fine bones.",
        ja: "皮を下にし、包丁の背で身をこそげ取り、小骨を避けます。",
        ko: "껍질을 아래로 두고 칼등으로 결 반대 방향으로 살을 긁어 냅니다."
      },
      meta: {
        zh: "刀背 · 逆纹", en: "Knife back · against the grain", ja: "包丁の背 · 逆目", ko: "칼등 · 결 반대"
      }
    },
    {
      no: "03", icon: "bowl",
      verb: { zh: "打", en: "beat", ja: "練る", ko: "치다" },
      title: { zh: "打浆", en: "Beat the paste", ja: "練る", ko: "치대기" },
      desc: {
        zh: "花椒水少量多次加入，顺一个方向搅到起胶、能立住筷子。",
        en: "Add pepper water little by little, stirring one way until the paste turns sticky enough to hold a chopstick upright.",
        ja: "花椒水を少しずつ加え、一方向に練って粘りを出します。",
        ko: "화자오물을 조금씩 넣으며 한 방향으로 저어 점성을 냅니다."
      },
      meta: {
        zh: "花椒水 · 150 ml", en: "Pepper water · 150 ml", ja: "花椒水 · 150 ml", ko: "화자오물 · 150 ml"
      }
    },
    {
      no: "04", icon: "chive",
      verb: { zh: "拌", en: "fold", ja: "和える", ko: "버무리다" },
      title: { zh: "和馅", en: "Fold the filling", ja: "和える", ko: "버무리기" },
      desc: {
        zh: "拌入韭菜末和少许五花肉，盐与油最后放，封住水分。",
        en: "Fold in chopped chives and a little pork belly; salt and oil last, to seal in the moisture.",
        ja: "ニラのみじん切りと少しの豚バラを混ぜ、塩と油は最後に。",
        ko: "다진 부추와 약간의 삼겹살을 넣고 소금과 기름은 마지막에 넣습니다."
      },
      meta: {
        zh: "韭菜 · 一把", en: "Chives · one handful", ja: "ニラ · 一握り", ko: "부추 · 한 줌"
      }
    },
    {
      no: "05", icon: "roller",
      verb: { zh: "擀", en: "roll", ja: "伸ばす", ko: "밀다" },
      title: { zh: "擀皮", en: "Roll the wrappers", ja: "皮を伸ばす", ko: "밀기" },
      desc: {
        zh: "中间厚、边缘薄，皮要薄到能透出馅的颜色。",
        en: "Roll thick in the middle, thin at the rim — thin enough for the filling's colour to show through.",
        ja: "中央は厚く、縁は薄く。餡の色が透けるくらいに。",
        ko: "가운데는 두껍게, 가장자리는 얇게. 소 색이 비칠 정도로."
      },
      meta: {
        zh: "中厚边薄", en: "Thick centre, thin rim", ja: "中厚・縁薄", ko: "가운데 두껍게, 가장자리 얇게"
      }
    },
    {
      no: "06", icon: "pot",
      verb: { zh: "点水", en: "dash", ja: "差し水", ko: "찬물 붓기" },
      title: { zh: "下锅", en: "Boil and dash", ja: "ゆでる", ko: "끓이기" },
      desc: {
        zh: "水开下锅，点三次凉水；饺子浮起、肚子鼓圆就熟了。",
        en: "Boil, then dash cold water three times; when they float and the bellies puff, they are done.",
        ja: "沸騰した湯に入れ、冷水を三度。浮き上がって膨らめば完成です。",
        ko: "끓는 물에 넣고 찬물을 세 번 부은 뒤, 떠오르며 배가 부풀면 익은 것입니다."
      },
      meta: {
        zh: "三滚三凉", en: "Three boils, three dashes", ja: "三度煮て三度冷ます", ko: "세 번 끓이고 세 번 식히기"
      }
    }
  ],

  /* ---------- 伍 · 词源侦探 ---------- */
  quiz: [
    {
      q: {
        zh: "英语 tea 来自哪种中国方言？",
        en: "Which Chinese dialect gave English the word 'tea'?",
        ja: "英語 tea は中国のどの方言から来たでしょう？",
        ko: "영어 tea는 중국의 어느 방언에서 왔을까요?"
      },
      options: [
        { text: { zh: "闽南语", en: "Min Nan", ja: "閩南語", ko: "민난어" } },
        { text: { zh: "粤语", en: "Cantonese", ja: "広東語", ko: "광둥어" } },
        { text: { zh: "四川话", en: "Sichuanese", ja: "四川語", ko: "쓰촨어" } },
        { text: { zh: "东北话", en: "Northeastern", ja: "東北方言", ko: "둥베이어" } }
      ],
      answer: 0,
      explain: {
        zh: "荷兰商人从闽南语 tê 借走这个音，写成 thee，英语才有了 tea；粤语的 cha 走的是葡萄牙语那条路，成了 chá。",
        en: "Dutch traders borrowed tê from Min Nan, spelled it thee, and English took tea. Cantonese cha took the Portuguese route and became chá.",
        ja: "オランダ商人が閩南語の tê を持ち帰り thee と綴り、英語の tea になりました。広東語の cha はポルトガル語の chá に。",
        ko: "네덜란드 상인이 민난어 tê를 빌려 thee로 적었고, 영어 tea가 되었습니다. 광둥어 cha는 포르투갈어 chá가 되었습니다."
      }
    },
    {
      q: {
        zh: "英语 kombu（昆布）是从哪种语言借来的？",
        en: "English 'kombu' was borrowed from which language?",
        ja: "英語 kombu（昆布）はどの言語から借りた言葉でしょう？",
        ko: "영어 kombu(곤부)는 어느 언어에서 빌려온 말일까요?"
      },
      options: [
        { text: { zh: "日语", en: "Japanese", ja: "日本語", ko: "일본어" } },
        { text: { zh: "韩语", en: "Korean", ja: "韓国語", ko: "한국어" } },
        { text: { zh: "马来语", en: "Malay", ja: "マレー語", ko: "말레이어" } },
        { text: { zh: "葡萄牙语", en: "Portuguese", ja: "ポルトガル語", ko: "포르투갈어" } }
      ],
      answer: 0,
      explain: {
        zh: "19 世纪末英语从日语借入 kombu，指可以煮高汤的干海带；山东荣成是中国最大的海带产区。",
        en: "English borrowed kombu from Japanese in the late 19th century for the dried kelp used in dashi. Rongcheng, Shandong, is China's largest kelp region.",
        ja: "英語は19世紀末に日本語の「昆布」を借り、出汁に使う乾燥昆布を kombu と呼びました。",
        ko: "영어는 19세기 말 일본어 '곤부'를 빌려 다시마를 kombu라 불렀습니다."
      }
    },
    {
      q: {
        zh: "英语 abalone（鲍鱼）最早可以追到哪种语言？",
        en: "English 'abalone' can be traced back to which language?",
        ja: "英語 abalone（アワビ）は、もともとどの言語にさかのぼるでしょう？",
        ko: "영어 abalone(전복)은 어느 언어까지 거슬러 올라갈까요?"
      },
      options: [
        { text: { zh: "北美原住民语言", en: "A Native Californian language", ja: "北米先住民の言語", ko: "북미 원주민 언어" } },
        { text: { zh: "西班牙语", en: "Spanish", ja: "スペイン語", ko: "스페인어" } },
        { text: { zh: "阿拉伯语", en: "Arabic", ja: "アラビア語", ko: "아랍어" } },
        { text: { zh: "荷兰语", en: "Dutch", ja: "オランダ語", ko: "네덜란드어" } }
      ],
      answer: 0,
      explain: {
        zh: "abalone 借自西班牙语 abulón，而 abulón 来自美国加州原住民语言 Rumsen 的 aulón。一个词绕了半个地球。",
        en: "Abalone came from Spanish abulón, which came from aulón in Rumsen, a Native Californian language. Half the globe for one word.",
        ja: "abalone はスペイン語 abulón から、さらにカリフォルニア先住民のルムセン語 aulón にさかのぼります。",
        ko: "abalone은 스페인어 abulón에서, 다시 캘리포니아 원주민 언어 럼센어 aulón에서 왔습니다."
      }
    },
    {
      q: {
        zh: "英语 junk（中国帆船）来自哪种语言？",
        en: "English 'junk', a Chinese sailing ship, came from which language?",
        ja: "中国の帆船を指す英語 junk は、どの言語から来たでしょう？",
        ko: "중국 범선을 뜻하는 영어 junk는 어느 언어에서 왔을까요?"
      },
      options: [
        { text: { zh: "马来语 / 爪哇语", en: "Malay / Javanese", ja: "マレー語 / ジャワ語", ko: "말레이어 / 자바어" } },
        { text: { zh: "汉语", en: "Chinese", ja: "中国語", ko: "중국어" } },
        { text: { zh: "日语", en: "Japanese", ja: "日本語", ko: "일본어" } },
        { text: { zh: "阿拉伯语", en: "Arabic", ja: "アラビア語", ko: "아랍어" } }
      ],
      answer: 0,
      explain: {
        zh: "经葡萄牙语 junco 借自马来语、爪哇语的 jong。另一个 junk（破烂）同形不同源。",
        en: "Via Portuguese junco from Malay/Javanese jong. The other 'junk' (rubbish) merely looks the same.",
        ja: "ポルトガル語 junco を経て、マレー語・ジャワ語の jong から。ゴミの junk とは別語です。",
        ko: "포르투갈어 junco를 거쳐 말레이·자바어 jong에서 왔습니다. 쓰레기 junk와는 다른 말입니다."
      }
    },
    {
      q: {
        zh: "日语里「ナマコ」的汉字写作？",
        en: "How is 'namako' written in Japanese kanji?",
        ja: "「ナマコ」を漢字で書くと？",
        ko: "'나마코(ナマコ)'를 한자로 쓰면?"
      },
      options: [
        { text: { zh: "海鼠", en: "海鼠", ja: "海鼠", ko: "海鼠" } },
        { text: { zh: "海参", en: "海参", ja: "海参", ko: "海参" } },
        { text: { zh: "海瓜", en: "海瓜", ja: "海瓜", ko: "海瓜" } },
        { text: { zh: "海人参", en: "海人参", ja: "海人参", ko: "海人参" } }
      ],
      answer: 0,
      explain: {
        zh: "日本人写作「海鼠」——海里的老鼠；中国人叫「海参」，英国人叫 sea cucumber。三种语言，三种想象。",
        en: "Japanese writes it 海鼠, 'sea rat'. Chinese says 'sea ginseng'; English says 'sea cucumber'. Three languages, three imaginations.",
        ja: "日本語では「海鼠」と書きます。中国語は「海参」、英語は sea cucumber。三つの言語、三つの想像。",
        ko: "일본어로는 '바다의 쥐(海鼠)'라고 씁니다. 중국어는 '바다의 인삼', 영어는 '바다의 오이'입니다."
      }
    }
  ],

  /* ---------- 陆 · 年表 ---------- */
  timeline: [
    {
      year: "7–13 世纪",
      dateLabel: { zh: "唐宋", en: "Tang–Song", ja: "唐・宋", ko: "당·송" },
      title: { zh: "登州与板桥镇", en: "Dengzhou and Banqiao", ja: "登州と板橋鎮", ko: "덩저우와 반차오진" },
      text: {
        zh: "登州（今蓬莱）是北方重要海港，密州板桥镇设市舶司。海船北上南下，鱼盐与瓷器同船而行。",
        en: "Dengzhou (today's Penglai) was a major northern port, and Banqiao in Mizhou hosted a maritime trade office. Ships carried fish, salt and porcelain together.",
        ja: "登州（今の蓬莱）は北方の重要な港で、密州板橋鎮には市舶司が置かれました。魚と塩、陶磁器が同じ船に乗っていました。",
        ko: "덩저우(오늘날 펑라이)는 북방의 중요한 항구였고, 미저우 반차오진에는 해상 무역 관청이 있었습니다."
      }
    },
    {
      year: "1271–1368",
      dateLabel: { zh: "元代", en: "Yuan", ja: "元", ko: "원" },
      title: { zh: "海上漕运", en: "The Sea Route of Grain", ja: "海上漕運", ko: "해상 조운" },
      text: {
        zh: "南粮北运，胶东沿海成为漕运与渔业的交汇处，港市因粮船而兴。",
        en: "Grain moved north by sea; the Jiaodong coast became a meeting point of shipping and fishing, and port towns grew with the grain fleets.",
        ja: "南の米を北へ運ぶ海路。膠東沿岸は漕運と漁業の交わるところとなり、港町が栄えました。",
        ko: "남쪽 곡식을 바다로 북쪽에 실어 나르면서 자오둥 해안은 조운과 어업이 만나는 곳이 되었습니다."
      }
    },
    {
      year: "1405–1433",
      dateLabel: { zh: "明代", en: "Ming", ja: "明", ko: "명" },
      title: { zh: "郑和与海禁之间", en: "Between Zheng He and the Sea Ban", ja: "鄭和と海禁のあいだ", ko: "정화와 해금 사이" },
      text: {
        zh: "郑和七下西洋，把瓷器与丝绸带向印度洋；同一时期，山东渔船仍在近海讨生活。",
        en: "Zheng He's seven voyages carried porcelain and silk to the Indian Ocean; meanwhile Shandong's fishing boats still worked the coastal waters.",
        ja: "鄭和の七度の航海は陶磁器と絹をインド洋へ運びました。同じ頃、山東の漁船は近海で暮らしを立てていました。",
        ko: "정화의 일곱 번 항해는 도자기와 비단을 인도양으로 실어 날랐습니다. 그 시기 산둥의 어선은 여전히 연안에서 삶을 이어 갔습니다."
      }
    },
    {
      year: "1861",
      dateLabel: { zh: "清 · 咸丰十一年", en: "Qing, 1861", ja: "清・咸豊十一年", ko: "청·함풍 11년" },
      title: { zh: "烟台开埠", en: "Yantai Opens", ja: "煙台開港", ko: "옌타이 개항" },
      text: {
        zh: "烟台成为山东第一个通商口岸，海关、领事馆、西式餐厅与海鲜贸易一起上岸。",
        en: "Yantai became Shandong's first treaty port: customs houses, consulates, Western restaurants and the seafood trade all came ashore together.",
        ja: "煙台は山東最初の通商港となり、税関・領事館・洋食店・海産物貿易がともに上陸しました。",
        ko: "옌타이는 산둥 최초의 통상 항구가 되었고, 세관과 영사관, 서양 식당, 해산물 무역이 함께 들어왔습니다."
      }
    },
    {
      year: "1984",
      dateLabel: { zh: "当代", en: "Today", ja: "現代", ko: "오늘" },
      title: { zh: "沿海开放", en: "Opening the Coast", ja: "沿海開放", ko: "연해 개방" },
      text: {
        zh: "青岛、烟台列入首批沿海开放城市，山东海鲜走上日韩与欧美的餐桌；今天，冷链与预制菜续写新的航线。",
        en: "Qingdao and Yantai joined the first wave of open coastal cities, and Shandong seafood reached tables in Japan, Korea, Europe and America. Today cold chains and prepared dishes write the next route.",
        ja: "青島と煙台は最初の沿海開放都市に選ばれ、山東の海産物は日韓・欧米の食卓へ。今はコールドチェーンと調理済み食品が新しい航路を描いています。",
        ko: "칭다오와 옌타이는 첫 연해 개방 도시가 되었고, 산둥 해산물은 한일과 구미의 식탁에 올랐습니다. 오늘은 콜드체인과 간편식이 새로운 항로를 씁니다."
      }
    }
  ],

  /* ---------- 伍 · 四时（一年绕海一圈） ---------- */
  seasons: [
    {
      id: "spring", no: "01",
      season: { zh: "春", en: "Spring", ja: "春", ko: "봄" },
      dish: { zh: "鲅鱼", en: "Mackerel", ja: "サワラ", ko: "삼치" },
      word: {
        zh: "鲅鱼 bà yú",
        en: "Japanese Spanish mackerel",
        ja: "サワラ（鰆）",
        ko: "삼치"
      },
      line: {
        zh: "春天鲅鱼洄游到近岸产卵，肉最厚。胶东的老话是「鲅鱼跳，丈人笑」——女婿提着最新鲜的一条去看岳父。",
        en: "In spring the mackerel runs inshore to spawn, its flesh at its thickest. Jiaodong has a saying: when the mackerel jumps, the father-in-law smiles — the son-in-law brings the freshest fish to his wife's parents.",
        ja: "春、サワラは産卵のために沿岸へ寄り、身が最も厚くなります。膠東の言い習わしは「サワラが跳ねれば、義父が笑う」。婿が一番新しい一尾を義父母へ届けるのです。",
        ko: "봄이면 삼치가 산란을 위해 연안으로 들어와 살이 가장 두툼해집니다. 자오둥의 옛말은 '삼치가 뛰면 장인이 웃는다'—사위가 가장 신선한 한 마리를 장인댁에 갖다 드립니다."
      },
      note: {
        zh: "同一条鱼，英语叫 Japanese Spanish mackerel，日语サワラ，韩语삼치。谁给谁命名，常常取决于谁的船先到。",
        en: "One fish, three names: Japanese Spanish mackerel in English, sawara in Japanese, samchi in Korean. Who names whom often depends on whose boat arrived first.",
        ja: "同じ魚が、英語では Japanese Spanish mackerel、日本語ではサワラ、韓国語では삼치。誰が誰に名をつけるかは、どちらの船が先に着いたかで決まります。",
        ko: "같은 물고기가 영어로는 Japanese Spanish mackerel, 일본어로는 사와라, 한국어로는 삼치입니다. 누가 누구에게 이름을 붙이는지는 어느 배가 먼저 닿았는지로 갈립니다."
      },
      meta: {
        zh: "农历三月 · 谷雨前后",
        en: "THIRD LUNAR MONTH · AROUND GUYU",
        ja: "旧暦三月 · 穀雨のころ",
        ko: "음력 3월 · 곡우 무렵"
      }
    },
    {
      id: "summer", no: "02",
      season: { zh: "夏", en: "Summer", ja: "夏", ko: "여름" },
      dish: { zh: "蛤蜊", en: "Clams", ja: "アサリ", ko: "바지락" },
      word: {
        zh: "蛤蜊 gé lí · 青岛话「嘎啦」",
        en: "clam",
        ja: "アサリ",
        ko: "바지락"
      },
      line: {
        zh: "夏夜的青岛，散啤装塑料袋，辣炒嘎啦装铁盘。蛤蜊在胶东话里叫「嘎啦」，两个音节，像壳与壳相碰。",
        en: "On a Qingdao summer night, draught beer comes in a plastic bag and spicy clams in an iron pan. The Jiaodong dialect calls a clam 'gá la' — two syllables knocking like shells.",
        ja: "夏の夜の青島。生ビールはビニール袋に、アサリの辛炒めは鉄板に。膠東方言ではアサリを「嘎啦」と呼び、貝と貝がぶつかる音のようです。",
        ko: "여름밤 칭다오에서는 생맥주를 비닐봉지에, 매운 바지락 볶음을 철판에 담습니다. 자오둥 방언의 '嘎啦'는 껍데기끼리 부딪는 두 음절입니다."
      },
      note: {
        zh: "英语 clam 在古英语里是「夹紧」的意思。一只合上壳的蛤蜊，就是一把小锁。",
        en: "English 'clam' comes from an Old English word meaning to clamp or grip. A closed clam is, quite literally, a small lock.",
        ja: "英語 clam は古英語で「締めつける」の意。殻を閉じたアサリは、小さな錠前なのです。",
        ko: "영어 clam은 고대 영어에서 '꽉 집다'를 뜻했습니다. 껍데기를 닫은 바지락은 작은 자물쇠입니다."
      },
      meta: {
        zh: "六月至八月 · 退潮后的滩涂",
        en: "JUNE–AUGUST · TIDAL FLATS AT LOW TIDE",
        ja: "六月から八月 · 干潟",
        ko: "6월에서 8월 · 썰물의 갯벌"
      }
    },
    {
      id: "autumn", no: "03",
      season: { zh: "秋", en: "Autumn", ja: "秋", ko: "가을" },
      dish: { zh: "梭子蟹", en: "Swimming Crab", ja: "ワタリガニ", ko: "꽃게" },
      word: {
        zh: "梭子蟹 suō zi xiè",
        en: "swimming crab",
        ja: "ワタリガニ（渡り蟹）",
        ko: "꽃게"
      },
      line: {
        zh: "秋风一起，莱州湾的梭子蟹开始囤膏。清蒸最好，任何调料都嫌多。",
        en: "When the autumn wind rises, swimming crabs in Laizhou Bay begin to fill with roe. Steam them plain — any seasoning is one too many.",
        ja: "秋風が吹くと、萊州湾のワタリガニは膏を蓄えます。蒸すだけが一番。薬味はどれも余計です。",
        ko: "가을바람이 불면 라이저우만의 꽃게가 알을 채웁니다. 찌는 것이 가장 좋고, 어떤 양념도 과합니다."
      },
      note: {
        zh: "梭子蟹学名 Portunus trituberculatus，英语常译 swimming crab：它会游，也横着走。",
        en: "Its scientific name is Portunus trituberculatus, often rendered 'swimming crab' — it swims, and it also walks sideways.",
        ja: "学名は Portunus trituberculatus。英語では swimming crab と訳されます。泳ぎもすれば、横歩きもします。",
        ko: "학명은 Portunus trituberculatus, 영어로는 swimming crab입니다. 헤엄도 치고 옆으로도 걷습니다."
      },
      meta: {
        zh: "九月至十一月 · 莱州湾",
        en: "SEPTEMBER–NOVEMBER · LAIZHOU BAY",
        ja: "九月から十一月 · 萊州湾",
        ko: "9월에서 11월 · 라이저우만"
      }
    },
    {
      id: "winter", no: "04",
      season: { zh: "冬", en: "Winter", ja: "冬", ko: "겨울" },
      dish: { zh: "牡蛎", en: "Oysters", ja: "カキ", ko: "굴" },
      word: {
        zh: "牡蛎 mǔ lì · 乳山牡蛎",
        en: "oyster",
        ja: "カキ（牡蠣）",
        ko: "굴"
      },
      line: {
        zh: "冬天的牡蛎最甜。乳山一带在浅海用筏架养殖，冷水期它们把养分存成糖原，肉才肥。",
        en: "Winter oysters are the sweetest. Around Rushan they are grown on rafts in shallow water; through the cold months they store food as glycogen, and the flesh turns plump.",
        ja: "冬のカキは最も甘い。乳山周辺では浅海の筏で養殖し、冷水期に養分をグリコーゲンとして蓄えるため身が肥えます。",
        ko: "겨울 굴이 가장 답니다. 루산 일대에서는 얕은 바다의 수하식(筏) 양식으로 기르며, 찬물철에 양분을 글리코겐으로 저장해 살이 통통해집니다."
      },
      note: {
        zh: "上桌的牡蛎英语叫 oyster；乳山养殖的太平洋牡蛎属名是 Magallana（旧属名 Crassostrea），Ostrea 是牡蛎科里另一个属（欧洲牡蛎等），不是它的属名。",
        en: "On the plate it is simply 'oyster'. The Pacific oyster farmed around Rushan belongs to the genus Magallana (formerly Crassostrea); Ostrea is a different genus in the same family, not its genus.",
        ja: "食卓では oyster。乳山で養殖される太平洋牡蠣の属名は Magallana（旧 Crassostrea）で、Ostrea は同じ科の別属（ヨーロッパガキなど）です。",
        ko: "식탁에서는 oyster. 루산에서 기르는 참굴(태평양굴)의 속명은 Magallana(옛 Crassostrea)이며, Ostrea는 같은 과의 다른 속(유럽굴 등)입니다."
      },
      meta: {
        zh: "十二月至二月 · 浅海筏架",
        en: "DECEMBER–FEBRUARY · RAFT CULTURE",
        ja: "十二月から二月 · 浅海筏",
        ko: "12월에서 2월 · 수하식 양식"
      }
    }
  ],

  /* ---------- 参考 ---------- */
  refs: [
    "《风味人间》第一季（陈晓卿，2018）—— 海洋与食物的叙事启发",
    "Wiktionary / Online Etymology Dictionary —— tea、clam、abalone、junk、kombu 词源核对",
    "FishBase —— 蓝点马鲛 Scomberomorus niphonius 的学名与分布",
    "山东省非物质文化遗产名录 —— 胶东海鲜烹饪技艺、蓬莱小面制作技艺",
    "山东省文化和旅游厅 —— 胶东海洋饮食文化资料",
    "自然资源部标准地图服务 —— 地图规范参考（本页为示意地图）"
  ],

  /* ---------- AI 创作说明（提交用中文，约 455 字） ---------- */
  aiStatement: [
    {
      h: "一、工具与用途",
      p: "网页结构、交互逻辑与样式由团队用 AI 编程助手（DeepSeek）辅助生成并逐行调试；多语种译名与词源初稿由 AI 辅助检索，再对照《在线词源词典》、Wiktionary 与 FishBase 人工核校；主视觉与菜品、工序、年表插画由 AI 绘图工具生成底稿，经人工筛选、调色与排版；地图依据公开地理数据绘制，线稿、图标与版式由团队完成。"
    },
    {
      h: "二、人工主导部分",
      p: "选题、叙事结构与全部中文文案由团队确定；青岛「嘎啦」、胶东「鲅鱼跳，丈人笑」等方言与民俗由团队成员结合家乡经验核对；英、日、韩译名由组内同学分语种审校，重点修正直译造成的文化错位。"
    },
    {
      h: "三、AI 修正示例",
      p: "AI 初稿把「海参」解释为「像黄瓜」，团队补充了「海中人参」的命名逻辑，并对比日语「海鼠」与英语 sea cucumber；AI 曾把「疙瘩汤」直译为 lump soup，团队改为 dough drop soup，并借日语すいとん、韩语수제비说明三种语言如何用动作词命名同一道家常。"
    },
    {
      h: "四、原创与合规声明",
      p: "作品创意、页面结构、交互设计与文案由团队原创；AI 辅助内容均经人工改写与核查；纪录片、词典与数据来源已在页面「参考与延伸」中注明；作品未参加过往届比赛。"
    }
  ]
};
