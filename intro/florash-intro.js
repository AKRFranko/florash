$(function() {
    var ipinfo;
    var iphash;

    var sha1 = function(str) {
        return CryptoJS.SHA1(str).toString(CryptoJS.enc.Hex);
    }

    var getDataURLS = function(hash, size) {
        var florash = new Florash(hash, {
            size: size
        });
        var identicon = new Identicon(hash, size).toString();
        return {
            florash: florash.toDataURL(),
            identicon: 'data:image/png;base64,' + identicon
        }
    }

    var selectText = function(element) {
        var doc = document,
            text = element,
            range, selection;
        if (doc.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    $.get("http://ipinfo.io", function(response) {
        ipinfo = response;
        var iphash = sha1(ipinfo.ip);
        var urls = getDataURLS(iphash, 512)
        $('#intro').css('background-image', 'url("' + urls.florash + '")');
        $('#ipicon').attr('src', urls.identicon).width(256).height(256);
        $('#ipflorash').attr('src', urls.florash).width(256).height(256);
        $('#intro').find('.iphash').text(iphash)
        $('#intro').find('.ipaddr').text(ipinfo.ip)
    }, "jsonp");

    $('#intro h1,pre,code,samp,dfn,abbr').on('click', function() {
        selectText($(this).get(0))
    });

    var renderHashTable = function(id, hashes) {
        var $table = $(id);
        $table.html("<tr><th>hash</th><th>florash</th><th>identicon</th></tr>");
        hashes.forEach(function(hash) {
            var urls = getDataURLS(hash, 128);
            var $row = $('<tr>').appendTo($table);
            $('<td>').html('<samp>' + hash + '</samp>').appendTo($row);
            $('<td>').append($('<img>').attr('src', urls.florash)).appendTo($row);
            $('<td>').append($('<img>').attr('src', urls.identicon)).appendTo($row);
        })
    }



    renderHashTable('#table-a', [
        'EF897CAB23EFCE2CAB23EF89112723EF897CAB23',
        'EF897CAB33EFCE2CAB23EF89112723EF897CAB23',
        'EF897CAB23EFCE0CAB23EF89112723EF897CAB23',
        'EF897CAB23EFCF2CAB23EF89112723EF897CAB23',
    ]);

    renderHashTable('#table-b', [
        '0000000000000000000000000000000000000001',
        '0000000000000000000000000000000000000002',
        '0000000000000000000000000000000000000003',
        '0000000000000000000000000000000000000004',
    ]);

    renderHashTable('#table-c', [
        '0000000000000000000000000000000000000000',
        'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
        '3333333333333333333333333333333333333333',
        '6666666666666666666666666666666666666666',
    ]);
    var randHash = function() {
        var n = Math.random() * (new Date()).getTime();
        return sha1(n.toString());
    }
    renderHashTable('#table-d', [
        randHash(),
        randHash(),
        randHash(),
        randHash(),
        randHash(),
        randHash(),
        randHash(),
        randHash()

    ]);

    $('#demo').on('keyup', function() {

        var str = $(this).val();
        if (!str) {
            $('#output').attr('src', '')
        } else {
            var urls = getDataURLS(sha1(str));
            $('#output').attr('src', urls.florash);
        }
    });

    $('#frankokey').attr('src', getDataURLS('D3B4FEC8AC70C97310BCF044E5277E9C98DFE316', 512).florash).attr('title', 'D3B4FEC8AC70C97310BCF044E5277E9C98DFE316')

})