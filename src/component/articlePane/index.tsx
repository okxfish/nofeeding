import React from "react";
export interface Props {
  className?: string;
}

const title: string = "The Declaration of Independence";
const sections: string[] = [
  "When in the course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the laws Nature and Nature’s God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.",
  "We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable rights, that they are among these are life, liberty and the pursuit of happiness. That to secure these rights, governments are instituted among them, deriving their just power from the consent of the governed. That whenever any form of government becomes destructive of these ends, it is the right of the people to alter or to abolish it, and to institute new government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their safety and happiness. Prudence, indeed, will dictate that governments long established should not be changed for light and transient causes; and accordingly all experience hath shown that mankind are more disposed to suffer, while evils are sufferable, than t right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same object evinces a design to reduce them under absolute despotism, it is their right, it is their duty, to throw off such government, and to provide new guards for their future security. Such has been the patient sufferance of these Colonies; and such is now the necessity, which constrains them to alter their former systems of government. The history of the present King of Great Britain is usurpations, all having in direct object tyranny over these States. To prove this, let facts be submitted to a candid world.",
  "He has refused his assent to laws, the most wholesome and necessary for the public good.",
  "He has forbidden his Governors to pass laws of immediate and pressing importance, unless suspended in their operation till his assent should be obtained; and when so suspended, he has utterly neglected to attend them.",
  "He has refused to pass other laws for the accommodation of large districts of people, unless those people would relinquish the right of representation in the Legislature, a right inestimable to them and formidable to tyrants only.",
  "He has called together legislative bodies at places unusual, uncomfortable, and distant from the depository of their public records, for the sole purpose of fatiguing them into compliance with his measures.",
  "He has dissolved representative houses repeatedly, for opposing with manly firmness his invasion on the rights of the people.",
  "He has refused for a long time, after such dissolution, to cause others to be elected ; whereby the legislative powers, incapable of annihilation, have returned to the people at large for their exercise; the State remaining in the meantime exposed to all the dangers of invasion from without and convulsion within.",
  "He has endeavored to prevent the population of these states; for that purpose obstructing the laws of naturalizing of foreigners; refusing to pass others to encourage their migration hither, and raising the condition of new appropriations of lands.",
  "He has obstructed the administration of justice, by refusing his assent of laws for establishing judiciary powers.",
  "He has made judges dependent on his will alone, for the tenure of their office, and the amount and payment of their salary.",
  "He has erected a multitude of new officers, and sent hither swarms of officers to harass our people, and eat out our substances.",
  "He has kept among us, in times of peace, standing armies without the consent of our legislatures.",
  "He has affected to render the military independent of and superior to the civil power.",
  "He has combined with others to subject us to a jurisdiction foreign to our constitution, and unacknowledged by our laws; giving his assent to their acts of pretended legislation.For quartering large bodies of armed troops among us;",
];

const ArticlePane = ({ className }: Props) => {
  const sectionsRender = () => {
    return sections.map((section: string): JSX.Element | null => (
      <section className="mb-4 text-base">
        <p>{section}</p>
      </section>
    ));
  };

  const contentRender = () => {
    return (
      <article className="max-w-3xl mx-auto py-4">
        <header>
          <h2 className="font-bold text-3xl mb-6">{title}</h2>
        </header>
        {sectionsRender()}
        <footer>
          from <a href="https://baidu.com">https://baidu.com</a>
        </footer>
      </article>
    );
  };

  return <div className="h-full overflow-auto scrollbar">{contentRender()}</div>;
};

export default ArticlePane;
