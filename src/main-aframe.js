function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(markers => {
            // let html = `${markers.map(marker => {
            //     return `<!-- handle barcode marker -->
            //     <a-marker type='barcode' value='${marker.value}'>
            //             <!-- Front -->
            //             <a-image rotation="0 0 0" position="0 0 0.5" src="${marker.images.front}" animation="property: rotation; from: 0 0 0; to: 0 360 0; dur: 1000; startEvents: click"></a-image>
            //             <!-- Back -->
            //             <a-image rotation="0 180 0" position="0 0 -0.5" src="${marker.images.back}"></a-image>
            //             <!-- Rigth -->
            //             <a-image rotation="0 90 0" position="0.5 0 0" src="${marker.images.left}"></a-image>
            //             <!-- Left -->
            //             <a-image rotation="0 -90 0" position="-0.5 0 0" src="${marker.images.rigth}"></a-image>
            //             <!-- Top -->
            //             <a-image rotation="-90 0 0" position="0 0.5 0" src="${marker.images.top}"></a-image>
            //     </a-marker>`
            // })}`;

            let html = `${markers.map(marker => {
                return `
                <!-- handle barcode marker -->
                <a-marker type='barcode' value='${marker.value}'>
                    <a-box position="0 0.5 0"
                        multisrc="srcs:${marker.images.rigth},${marker.images.left},${marker.images.back},${marker.images.front},${marker.images.top},${marker.images.top}"
                        material="transparent: true; opacity: 0.95; side: double;"
                        animation="property: rotation; to: 0 360 0; loop: true; dur: 10000">
                    </a-box>
                </a-marker>`
            })}`;

            const element = document.getElementById("markers");
            const parent = document.createElement('div');
            parent.innerHTML = html;
            element.replaceWith(...Array.from(parent.childNodes));
    });
}

document.addEventListener("DOMContentLoaded", function(event) {
    loadData();
});