<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="q-gutter-y-md">
        <q-tabs
          v-model="tab"
          narrow-indicator
          dense
          align="justify"
          class="text-indigo-10"
          style="max-width: 400px"
        >
          <q-tab :ripple="false" name="game-rules" icon="article" label="GAME RULES" />
          <q-tab :ripple="false" name="faq" icon="help" label="FAQ" />
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="game-rules">
            <div v-for="rule in gameRules" :key="rule.ruleId">
              <h3 class="text-h5 text-indigo-10 q-py-sm">{{ rule.heading }}</h3>
              <div v-for="d in rule.details" :key="d" class="text-grey-10">
                <p class="q-ml-md">{{ d }}</p>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="faq">
            <div class="q-pa-sm" v-for="f in faq" :key="f.faqId">
              <q-expansion-item
                class="shadow-1 overflow-hidden"
                style="border-radius: 4px"
                icon="help"
                :label="f.question"
                header-class="bg-indigo-10 text-white"
                expand-icon-class="text-white"
              >
                <q-card>
                  <q-card-section>
                    {{ f.answer }}
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: 'game-rules',
      gameRules: [
        {
          ruleId: 1,
          heading: '概要',
          details: [
            'Blokeeは4人用の戦略ゲームです。各プレイヤーは、21個のテトリス型のピースを持ってスタートします。',
            'プレイヤーは配置ルールに従って、20x20の共有ボードに順番にピースを配置していきます。このゲームの目的は、できるだけ多くのピースを配置することです。',
          ],
        },
        {
          ruleId: 2,
          heading: '配置ルール',
          details: [
            '1) 最初のピースの時は、ボードの角に重なるように置きます。',
            '2) 2つ目以降は、その角の少なくとも1つが、すでに配置した他のピースの角に接するようにします。',
            '3) ただし、どの辺もすでに配置した他のピースの辺に触れることはできません。',
            '4) 他のプレイヤーのピースは、あなたの配置に影響を与えません。また、自分のピースが相手に触れても問題ありません。',
          ],
        },
        {
          ruleId: 3,
          heading: 'ゲーム終了',
          details: [
            '配置できない場合、プレイヤーはパスを選択することができます。一度パスしたプレイヤーは、その後のゲームではもう配置することができません。',
            '残っているマスの数が少ない人が勝者となります。ピースの数ではなく、マスの数であることに注意してください（例：5つのマスを含むピースもあれば、1つのマスを含むピースもある）。',
          ],
        },
        {
          ruleId: 4,
          heading: 'ゲームのカスタマイズ',
          details: [
            '1）2人プレイモード。Blokeeは2人だけのプレイも可能です。',
            'この場合、ボードのサイズは14x14に縮小され、2人のプレーヤーは反対側のコーナーからスタートします。',
            '2) 異なる位置からのゲーム開始',
            '通常のゲームでは、最初のピースは自分のエリアの角から置き始めますが、スタート位置は他に2つあります。',
            'i) Corner - 最初のピースを自分のコーナーに置く標準バージョン',
            'ii) Center - 最初のピースが4つの中央のスポットのいずれかに触れていなければならない',
            'iii) Anywhere -最初のピースはどこに置いてもよい',
            'ただしどの形式でも、最初のピースは他のプレイヤーの領域に侵入してはいけません。つまり、ピース全体が自分の陣地に収まらなければなりません。',
          ],
        },
      ],
      faq: [
        {
          faqId: 1,
          question: '３人でプレイできますか?',
          answer: 'いいえ、2人もしくは4人のいずれかになります。',
        },
        {
          faqId: 2,
          question: '順位はどのように決まっていますか？',
          answer:
            '残りのピースのマスの数が少ないプレイヤーほど上位になります。マスの数が同じ場合は、残り時間がより多く残っているプレイヤーが上位になります。',
        },
        {
          faqId: 3,
          question: 'CPUの難易度にはどのような基準が設けられていますか？',
          answer:
            'Easyレベル: ランダムにピースを選択＋ランダムに次に配置可能な位置を選択、Mediumレベル: 大きいピースを選択＋ランダムに次に配置可能な位置を選択、Hardレベル: 貪欲法を用いて最適な一手を選択',
        },
      ],
    };
  },
};
</script>

<style>
h3 {
  position: relative;
  padding: 0.5rem;
  margin-bottom: 0.5em;
}

h3:after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  content: '';
  border-radius: 2px;
  background-image: linear-gradient(to left, #fff 0%, #04384c 100%);
}
</style>
