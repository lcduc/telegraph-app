const BRANDING_AD_SRC = 'https://adi.admicro.vn/adt/branding/2025/06/1920x350halongma_4047_1776847447.html?url=%2F%2Flg1.logging.admicro.vn%2Fatvc%3Fp%3D1328051%253B631455%253B33668%253B-1%253B-1%253B9%253B0%253B0%253Bcafef.vn%26path%3D%252F%26cov%3D1%26lsn%3D1777350704219%26ce%3D1%26lc%3D%26cr%3D%26ui%3D%26dg%3D05e544029b05e7de299702fc2aabb5ad%26uuid%3D%26profileID%3D%26encodebid%3D63582972820%26sspz%3D2089%26sspr%3D%26ctr%3D%26rid%3D0119iv46eqi6g03%26re%3Dhttps%253A%252F%252Fthesea.com.vn%252F%253Futm_source%253DAdmicro%2526utm_medium%253DBranding%2526utm_campaign%253DFullpagePlus_HalongMarina_CafeF&vast=https%3A%2F%2Fbrandingdatavast.cdnstoremedia.com%2Finfo%3Fu%3Dcafef.vn%2F%26z%3D33668%26p%3D1%26w%3D650%26h%3D300%26%26lsn%3D1777350704219%26dgid%3D05e544029b05e7de299702fc2aabb5ad%26l%3D%26loc%3D%26i%3D%26isdetail%3D0%26pid%3D%26tags%3D5%26adstype%3D%26vtype%3D8%26vid%3D%26bannerid%3D631455%26id%3D%26ua%3DMozilla%252F5.0%2520(Windows%2520NT%252010.0%253B%2520Win64%253B%2520x64)%2520AppleWebKit%252F537.36%2520(KHTML%252C%2520like%2520Gecko)%2520Chrome%252F147.0.0.0%2520Safari%252F537.36&admid=titahotIframe_33668_2089_631455&autoplay=0&temp=0&loc=4&weath=';
const DHC_HREF = 'https://shopee.vn/universal-link/dhc_officialstore?deep_and_web=1&utm_campaign=s44806875_ss_vn_orgn_partnership-thang3-2026&utm_source=others&utm_medium=seller&utm_content=cupchienthang-baochi-productlistshopee-campt32026&smtt=9';
const DHC_IMAGE_SRC = 'https://media.webthethao.vn/uploads/ads/dhc.jpg';

function BrandingAdCard({ children }) {
  return (
    <div className="w-[300px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      {children}
    </div>
  );
}

function DhcAdCard({ children }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      {children}
    </div>
  );
}

function BrandingBanner() {
  return (
    <BrandingAdCard>
      <div className="w-[300px] h-[600px] bg-black">
        <iframe
          title="Branding advertisement"
          src={BRANDING_AD_SRC}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          className="h-full w-full border-0"
          loading="eager"
        />
      </div>
    </BrandingAdCard>
  );
}

function DhcBanner() {
  return (
    <DhcAdCard>
      <a href={DHC_HREF} title="DHC" target="_blank" rel="noreferrer" className="block w-full bg-black">
        <img src={DHC_IMAGE_SRC} alt="DHC" className="block h-auto w-full object-contain" />
      </a>
    </DhcAdCard>
  );
}

export default function BrandingAd({ adKey }) {
  if (adKey === 'branding') {
    return <BrandingBanner />;
  }

  if (adKey === 'dhc') {
    return <DhcBanner />;
  }

  return (
    <div className="mb-8 space-y-4">
      <BrandingBanner />
      <DhcBanner />
    </div>
  );
}
